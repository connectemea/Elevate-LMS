import { prisma } from './prisma'

export async function getOverallProgressStats() {
  const totalSessions = await prisma.session.count()
  const totalParticipants = await prisma.participant.count()
  
  const sessionProgress = await prisma.sessionProgress.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
  })

  const completedCount = sessionProgress.find((s: any) => s.status === 'completed')?._count.id || 0
  const inProgressCount = sessionProgress.find((s: any) => s.status === 'in_progress')?._count.id || 0

  return {
    totalSessions,
    totalParticipants,
    completedSessions: completedCount,
    inProgressSessions: inProgressCount,
    completionRate: totalParticipants > 0 ? (completedCount / (totalSessions * totalParticipants)) * 100 : 0,
  }
}

export async function getDashboardStats() {
  const [
    participantStats,
    courseStats,
    overallProgress,
    popularCourses
  ] = await Promise.all([
    prisma.participant.aggregate({
      _count: { id: true },
      _avg: { year: true }
    }),
    prisma.course.aggregate({
      _count: { id: true }
    }),
    getOverallProgressStats(),
    prisma.course.findMany({
      include: {
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      },
      take: 5
    })
  ])

  return {
    totalParticipants: participantStats._count.id,
    averageYear: participantStats._avg.year,
    totalCourses: courseStats._count.id,
    overallProgress,
    popularCourses
  }
}