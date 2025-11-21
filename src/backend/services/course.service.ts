// src/backend/services/course.service.ts
import prisma from "@/backend/db/prisma";

export const courseService = {
  /* -------------------------------------------------------------------------- */
  /*                               BASIC CRUD                                  */
  /* -------------------------------------------------------------------------- */

  async getAll() {
    return prisma.course.findMany({
      include: {
        categories: {
          orderBy: { orderIndex: "asc" },
          include: { sessions: { orderBy: { orderIndex: "asc" } } },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(data: { name: string; description?: string }) {
    return prisma.course.create({ data });
  },

 async getById(id: string, participantId?: string) {
  const include: any = {
    categories: {
      orderBy: { orderIndex: "asc" },
      include: {
        sessions: {
          orderBy: { orderIndex: "asc" },
          include: {},   // we will fill this conditionally
        },
      },
    },
    _count: { select: { enrollments: true } },
  };

  // Only add progress if participantId is provided
  if (participantId) {
    include.categories.include.sessions.include.progress = {
      where: { participantId },
    };
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include,
  });

  if (!course) return null;

  return course;
},

  async update(id: string, data: { name?: string; description?: string }) {
    return prisma.course.update({
      where: { id },
      data,
    });
  },

  async deleteById(id: string) {
    return prisma.course.delete({ where: { id } });
  },

  /* -------------------------------------------------------------------------- */
  /*                             ENROLLMENTS LOGIC                              */
  /* -------------------------------------------------------------------------- */

  async getEnrollments(courseId: string) {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId },
      include: {
        participant: {
          select: {
            id: true,
            name: true,
            email: true,
            sessionStatus: {
              where: { session: { category: { courseId } } },
              select: { status: true, sessionId: true },
            },
          },
        },
        course: {
          select: {
            categories: {
              select: { sessions: { select: { id: true } } },
            },
          },
        },
      },
    });

    return enrollments.map((e) => {
      const allSessions = e.course.categories.flatMap((c: any) => c.sessions);
      const total = allSessions.length;

      const completed = e.participant.sessionStatus.filter(
        (s: any) => s.status === "completed"
      ).length;

      const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

      return {
        enrollmentId: e.id,
        courseId: e.courseId,
        user: {
          id: e.participant.id,
          name: e.participant.name,
          email: e.participant.email,
        },
        progress,
        completedSessions: completed,
        totalSessions: total,
        enrolledAt: e.enrolledAt,
      };
    });
  },

  async getAvailableUsers(courseId: string) {
    const enrolled = await prisma.courseEnrollment.findMany({
      where: { courseId },
      select: { participantId: true },
    });

    const excludedIds = enrolled.map((e) => e.participantId);

    return prisma.participant.findMany({
      where: excludedIds.length ? { id: { notIn: excludedIds } } : {},
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });
  },

  async bulkEnroll(courseId: string, participantIds: string[]) {
    if (!participantIds.length) return { enrolled: 0 };

    const res = await prisma.courseEnrollment.createMany({
      data: participantIds.map((pid) => ({
        participantId: pid,
        courseId,
      })),
      skipDuplicates: true,
    });

    return { enrolled: res.count ?? 0 };
  },
};
