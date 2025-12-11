// backend/services/participant.service.ts
import prisma from "@/backend/db/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type ParticipantListItem = {
  id: string;
  name: string;
  email?: string | null;
  year: number;
  createdAt: Date;
  enrollments: {
    courseId: string;
    courseName: string;
    progress: number | null;
  }[];
  stats: {
    totalCourses: number;
    completedSessions: number;
  };
};

export type ParticipantDetail = {
  id: string;
  name: string;
  email?: string | null;
  year: number;
  createdAt: Date;
  stats: {
    totalCourses: number;
    totalSessions: number;
    completedSessions: number;
    progress: number; // 0-100
  };
  enrollments: Array<{
    enrollmentId: string;
    courseId: string;
    courseName: string;
    description?: string | null;
    progress: number | null;
    enrolledAt: Date;
    totalSessions: number;
  }>;
  sessionHistory: Array<{
    sessionId: string;
    title: string;
    assetType: string;
    status: "in_progress" | "completed";
    updatedAt: Date;
    category: string;
    course: string;
  }>;
};

export const participantService = {
  /**
   * Lightweight list for participants table.
   * - pulls a small preview of enrollments (max 3)
   * - supplies counts for UI without heavy nested trees
   */
  async getAll(): Promise<ParticipantListItem[]> {
    const rows = await prisma.participant.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            sessionStatus: {
              where: { status: "completed" },
            },
          },
        },
        enrollments: {
          take: 3,
          orderBy: { enrolledAt: "desc" },
          select: {
            course: { select: { id: true, name: true } },
            progress: true,
          },
        },
      },
    });

    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      year: p.year,
      createdAt: p.createdAt,
      enrollments: p.enrollments.map((e) => ({
        courseId: e.course.id,
        courseName: e.course.name,
        progress: e.progress ?? null,
      })),
      stats: {
        totalCourses: p._count.enrollments,
        completedSessions: p._count.sessionStatus,
      },
    }));
  },

  /**
   * Create a new participant:
   * - creates user in Supabase Auth (admin)
   * - inserts participant record using auth user id
   */
  async create(data: { name: string; email: string; year: number }) {
    // check duplicate email in participants table
    const exists = await prisma.participant.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (exists) throw new Error("EMAIL_EXISTS");

    const password = `${data.email.split("@")[0]}${data.year}`;

    const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password,
      email_confirm: true,
      user_metadata: {
        name: data.name,
        year: data.year,
        role: "participant",
      },
    });

    if (error) throw new Error(error.message);

    return prisma.participant.create({
      data: {
        id: authUser.user.id,
        name: data.name,
        email: data.email,
        year: data.year,
      },
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        createdAt: true,
      },
    });
  },

  /**
   * Participant detail optimized:
   * - fetch participant core (single query)
   * - fetch enrollments with course basic info (single include)
   * - fetch sessionProgress for participant (single query)
   * - compute totalSessions per-course using parallel counts (one per course; cheap for small N)
   *
   * This avoids fetching full category->session trees unless UI explicitly needs them.
   */
  async getById(id: string): Promise<ParticipantDetail | null> {
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
          orderBy: { enrolledAt: "desc" },
        },
        sessionStatus: {
          include: {
            session: {
              select: {
                id: true,
                title: true,
                assetType: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    course: {
                      select: { id: true, name: true },
                    },
                  },
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        },
      },
    });

    if (!participant) return null;

    // get list of unique enrolled course IDs
    const enrolledCourseIds = Array.from(
      new Set(participant.enrollments.map((e) => e.course.id))
    );

    // For each course get total sessions. Run counts in parallel.
    const sessionsCounts = await Promise.all(
      enrolledCourseIds.map((courseId) =>
        prisma.session.count({
          where: { category: { courseId } },
        }).then((count) => ({ courseId, count }))
      )
    );
    const countsMap = new Map(sessionsCounts.map((r) => [r.courseId, r.count]));

    // compute totalSessions across all enrolled courses
    const totalSessions = participant.enrollments.reduce((sum, e) => {
      return sum + (countsMap.get(e.course.id) ?? 0);
    }, 0);

    const completedSessions = participant.sessionStatus.filter(
      (s) => s.status === "completed"
    ).length;

    const enrollmentsMapped = participant.enrollments.map((e) => ({
      enrollmentId: e.id,
      courseId: e.course.id,
      courseName: e.course.name,
      description: e.course.description,
      progress: e.progress ?? null,
      enrolledAt: e.enrolledAt,
      totalSessions: countsMap.get(e.course.id) ?? 0,
    }));

    const sessionHistory = participant.sessionStatus.map((s) => ({
      sessionId: s.session.id,
      title: s.session.title,
      assetType: s.session.assetType as string,
      status: s.status as "in_progress" | "completed",
      updatedAt: s.updatedAt,
      category: s.session.category.name,
      course: s.session.category.course.name,
    }));

    return {
      id: participant.id,
      name: participant.name,
      email: participant.email,
      year: participant.year,
      createdAt: participant.createdAt,
      stats: {
        totalCourses: participant.enrollments.length,
        totalSessions,
        completedSessions,
        progress:
          totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      },
      enrollments: enrollmentsMapped,
      sessionHistory,
    };
  },

  /**
   * Update participant (simple)
   */
  async update(id: string, data: { name?: string; email?: string; year?: number }) {
    if (data.email) {
      const exists = await prisma.participant.findFirst({
        where: { email: data.email, id: { not: id } },
        select: { id: true },
      });
      if (exists) throw new Error("EMAIL_EXISTS");
    }

    return prisma.participant.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        createdAt: true,
      },
    });
  },

  /**
   * Delete participant + cleanup related rows in a transaction.
   */
  async deleteById(id: string) {
    return prisma.$transaction(async (tx) => {
      await tx.sessionProgress.deleteMany({ where: { participantId: id } });
      await tx.courseEnrollment.deleteMany({ where: { participantId: id } });

      const deleted = await tx.participant.delete({
        where: { id },
        select: { email: true },
      });

      try {
        await supabaseAdmin.auth.admin.deleteUser(id);
      } catch (err) {
        // keep backend resilient if auth delete fails
        console.warn("supabase delete user failed", (err as Error).message);
      }

      return { email: deleted.email };
    });
  },

  /**
   * Bulk create participants (wraps create; collects errors)
   */
  async bulkCreate(participants: Array<{ name: string; email: string; year: number }>) {
    const results: any[] = [];
    const errors: any[] = [];

    for (const p of participants) {
      try {
        const created = await this.create(p);
        results.push(created);
      } catch (err: any) {
        errors.push({ email: p.email, error: err.message });
      }
    }

    return { created: results.length, results, errors };
  },

  /**
   * Small dashboard statistics useful for admin overview
   */
  async getStatistics() {
    const [totalParticipants, yearlyStats, recentParticipants] = await Promise.all([
      prisma.participant.count(),
      prisma.participant.groupBy({
        by: ["year"],
        _count: true,
        orderBy: { year: "desc" },
      }),
      prisma.participant.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          year: true,
          createdAt: true,
          _count: {
            select: {
              enrollments: true,
              sessionStatus: { where: { status: "completed" } },
            },
          },
        },
      }),
    ]);

    return {
      totalParticipants,
      yearlyStats,
      recentParticipants: recentParticipants.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        year: p.year,
        createdAt: p.createdAt,
        stats: {
          totalCourses: p._count.enrollments,
          completedSessions: p._count.sessionStatus,
        },
      })),
    };
  },
};
