import { prisma } from './prisma'

export async function getCourseEnrollmentStats() {
  return await prisma.courseEnrollment.groupBy({
    by: ['courseId'],
    _count: {
      participantId: true,
    },
    _avg: {
      progress: true,
    },
    having: {
      courseId: {
        not: undefined,
      },
    },
  })
}

export async function getPopularCourses(limit: number = 5) {
  return await prisma.course.findMany({
    include: {
      _count: {
        select: {
          enrollments: true,
        },
      },
      enrollments: {
        select: {
          progress: true,
        },
      },
    },
    orderBy: {
      enrollments: {
        _count: 'desc',
      },
    },
    take: limit,
  })
}

export async function getCourseCompletionStats(courseId: string) {
  const sessionsCount = await prisma.session.count({
    where: {
      category: {
        courseId: courseId,
      },
    },
  })

  const enrollments = await prisma.courseEnrollment.findMany({
    where: {
      courseId: courseId,
    },
    include: {
      participant: {
        include: {
          _count: {
            select: {
              sessionStatus: {
                where: {
                  status: 'completed',
                  session: {
                    category: {
                      courseId: courseId,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  return enrollments.map((enrollment: any) => ({
    participant: enrollment.participant.name,
    completedSessions: enrollment.participant._count.sessionStatus,
    totalSessions: sessionsCount,
    completionPercentage: (enrollment.participant._count.sessionStatus / sessionsCount) * 100,
  }))
}