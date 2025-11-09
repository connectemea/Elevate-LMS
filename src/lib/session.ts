import { prisma } from './prisma'

export async function getSessionProgressStats() {
  return await prisma.sessionProgress.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
  })
}

export async function getCompletionByAssetType() {
  const sessionsWithProgress = await prisma.session.findMany({
    include: {
      _count: {
        select: {
          progress: {
            where: {
              status: 'completed'
            }
          }
        }
      },
      progress: true
    }
  })

  return sessionsWithProgress.map((session: any) => ({
    sessionId: session.id,
    title: session.title,
    assetType: session.assetType,
    totalParticipants: session.progress.length,
    completedParticipants: session._count.progress,
    completionRate: (session._count.progress / session.progress.length) * 100 || 0
  }))
}