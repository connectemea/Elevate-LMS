import { prisma } from './prisma'

export async function getParticipantStats() {
  return await prisma.participant.aggregate({
    _count: {
      id: true,
    },
    _avg: {
      year: true,
    },
    _min: {
      year: true,
    },
    _max: {
      year: true,
    },
  })
}

export async function getParticipantsWithEnrollmentCount() {
  return await prisma.participant.findMany({
    include: {
      _count: {
        select: {
          enrollments: true,
          sessionStatus: true,
        },
      },
    },
  })
}

export async function getProgressByYear() {
  return await prisma.participant.groupBy({
    by: ['year'],
    _count: {
      id: true,
    },
    _avg: {
      enrollments: {
        _avg: {
          progress: true,
        },
      },
    },
    having: {
      year: {
        not: undefined,
      },
    },
  })
}