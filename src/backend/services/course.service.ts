import prisma from "@/backend/db/prisma";

export type CourseListItem = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    enrollments: number;
  };
};

export type CourseDetail = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { enrollments: number };
  categories: Array<{
    id: string;
    name: string;
    orderIndex: number;
    sessions: Array<{
      id: string;
      title: string;
      assetLink: string;
      assetType: string;
      orderIndex: number;
      userProgress?: "in_progress" | "completed" | null;
    }>;
  }>;
};

export const courseService = {
  async getAll(): Promise<CourseListItem[]> {
    const rows = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { enrollments: true } },
      },
    });

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      stats: { enrollments: r._count.enrollments },
    }));
  },

  async create(data: { name: string; description?: string }) {
    return await prisma.course.create({
      data,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
    });
  },

 
  async getById(id: string, participantId?: string): Promise<CourseDetail | null> {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        _count: { select: { enrollments: true } },
        categories: {
          orderBy: { orderIndex: "asc" },
          include: {
            sessions: {
              orderBy: { orderIndex: "asc" },
              include: participantId
                ? { progress: { where: { participantId } } } // progress is relation
                : undefined,
            },
          },
        },
      },
    });

    if (!course) return null;

    const transformed: CourseDetail = {
      id: course.id,
      name: course.name,
      description: course.description,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      _count: { enrollments: course._count.enrollments },
      categories: course.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        orderIndex: cat.orderIndex,
        sessions: cat.sessions.map((s: any) => {
          const progressArray = Array.isArray((s as any).progress) ? (s as any).progress : [];
          return {
            id: s.id,
            title: s.title,
            assetLink: s.assetLink,
            assetType: String(s.assetType),
            orderIndex: s.orderIndex,
            userProgress: progressArray.length ? (progressArray[0].status as "in_progress" | "completed") : null,
          };
        }),
      })),
    };

    return transformed;
  },

  async update(id: string, data: { name?: string; description?: string }) {
    return prisma.course.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
      },
    });
  },

  async delete(id: string) {
    return prisma.course.delete({ where: { id } });
  },

  async getEnrollments(courseId: string) {
    const totalSessions = await prisma.session.count({
      where: { category: { courseId } },
    });

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId },
      select: {
        id: true,
        participant: {
          select: { id: true, name: true, email: true, year: true },
        },
        progress: true, 
        enrolledAt: true,
      },
      orderBy: { enrolledAt: "desc" },
    });

    return enrollments.map((e) => ({
      enrollmentId: e.id,
      user: {
        id: e.participant.id,
        name: e.participant.name,
        email: e.participant.email,
        year: e.participant.year,
      },
      completedSessions: Math.round((e.progress ?? 0) * (totalSessions / Math.max(1, totalSessions)) ),
      totalSessions,
      progress: typeof e.progress === "number" ? Math.round(e.progress) : 0,
      enrolledAt: e.enrolledAt,
      courseId,
    }));
  },

  getAvailableUsers(courseId: string) {
    return prisma.participant.findMany({
      where: {
        enrollments: { none: { courseId } },
      },
      select: { id: true, name: true, email: true, year: true },
      orderBy: { name: "asc" },
    });
  },

  async bulkEnroll(courseId: string, participantIds: string[]) {
    if (!participantIds.length) return { enrolled: 0 };

    const result = await prisma.courseEnrollment.createMany({
      data: participantIds.map((pid) => ({ participantId: pid, courseId })),
      skipDuplicates: true,
    });

    return { enrolled: result.count };
  },

  async getStats(courseId: string) {
    const [totalEnrollments, totalSessions] = await Promise.all([
      prisma.courseEnrollment.count({ where: { courseId } }),
      prisma.session.count({ where: { category: { courseId } } }),
    ]);

    return { totalEnrollments, totalSessions };
  },
};
