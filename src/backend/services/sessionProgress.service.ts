import prisma from "@/backend/db/prisma";
import { SessionStatus } from "@prisma/client";

export const sessionProgressService = {
  async updateProgress(
    sessionId: string,
    participantId: string,
    status: SessionStatus
  ) {
    // Upsert row
    const progress = await prisma.sessionProgress.upsert({
      where: {
        sessionId_participantId: {
          sessionId,
          participantId,
        },
      },
      update: {
        status, // TS now ensures it's a valid enum
        updatedAt: new Date(),
      },
      create: {
        sessionId,
        participantId,
        status,
      },
      include: {
        session: {
          include: {
            category: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    const courseId = progress.session.category.courseId;

    await this.recalculateCourseProgress(participantId, courseId);

    return progress;
  },

  async recalculateCourseProgress(participantId: string, courseId: string) {
    const sessions = await prisma.session.findMany({
      where: { category: { courseId } },
      include: {
        progress: {
          where: { participantId },
        },
      },
    });

    const total = sessions.length;
    const completed = sessions.filter((s) =>
      s.progress.some((p) => p.status === "completed")
    ).length;

    const progress = total ? Math.round((completed / total) * 100) : 0;

    await prisma.courseEnrollment.updateMany({
      where: { participantId, courseId },
      data: { progress },
    });

    return progress;
  },
};
