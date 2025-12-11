import prisma from "@/backend/db/prisma";
import { SessionStatus } from "@prisma/client";

export const sessionProgressService = {
  /**
   * Update progress for a single session.
   * Auto-recalculates course progress.
   */
  async updateProgress(
    sessionId: string,
    participantId: string,
    status: SessionStatus
  ) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        category: { select: { courseId: true } },
      },
    });

    if (!session) throw new Error("Session not found");

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      select: { id: true },
    });

    if (!participant) throw new Error("Participant not found");

    // Upsert (safe)
    const progress = await prisma.sessionProgress.upsert({
      where: {
        sessionId_participantId: { sessionId, participantId },
      },
      create: { sessionId, participantId, status },
      update: { status, updatedAt: new Date() },
    });

    // Recalculate aggregated course progress
    await this.recalculateCourseProgress(participantId, session.category.courseId);

    return progress;
  },

  /**
   * Recalculate participant progress inside a given course.
   */
  async recalculateCourseProgress(participantId: string, courseId: string) {
    const [totalSessions, completedSessions] = await Promise.all([
      prisma.session.count({
        where: { category: { courseId } },
      }),

      prisma.sessionProgress.count({
        where: {
          participantId,
          status: "completed",
          session: { category: { courseId } },
        },
      }),
    ]);

    const progress =
      totalSessions > 0
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0;

    await prisma.courseEnrollment.updateMany({
      where: { participantId, courseId },
      data: { progress },
    });

    return { progress, totalSessions, completedSessions };
  },

  /**
   * Get progress of 1 session.
   */
  getSessionProgress(sessionId: string, participantId: string) {
    return prisma.sessionProgress.findUnique({
      where: { sessionId_participantId: { sessionId, participantId } },
      include: {
        session: {
          select: {
            title: true,
            assetType: true,
            category: { select: { name: true, course: { select: { name: true } } } },
          },
        },
      },
    });
  },

  /**
   * Get all progress for a participant inside a course.
   */
  async getCourseProgress(participantId: string, courseId: string) {
    const [sessions, progress] = await Promise.all([
      prisma.session.findMany({
        where: { category: { courseId } },
        select: { id: true },
      }),

      prisma.sessionProgress.findMany({
        where: {
          participantId,
          session: { category: { courseId } },
        },
        select: {
          sessionId: true,
          status: true,
          updatedAt: true,
          session: {
            select: {
              title: true,
              assetType: true,
              category: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    const totalSessions = sessions.length;
    const completedSessions = progress.filter((p) => p.status === "completed").length;

    return {
      totalSessions,
      completedSessions,
      progress: totalSessions
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0,
      sessionProgress: progress,
    };
  },

  /**
   * Bulk updates for marking multiple sessions completed.
   */
  async bulkUpdateProgress(
    participantId: string,
    list: Array<{ sessionId: string; status: SessionStatus }>
  ) {
    const results = [];

    for (const item of list) {
      try {
        const res = await this.updateProgress(item.sessionId, participantId, item.status);
        results.push({ sessionId: item.sessionId, success: true, data: res });
      } catch (err: any) {
        results.push({ sessionId: item.sessionId, success: false, error: err.message });
      }
    }

    return results;
  },
};
