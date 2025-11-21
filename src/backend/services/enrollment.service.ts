import prisma from "@/backend/db/prisma";

export const enrollmentService = {
  async singleEnroll(courseId: string, participantId: string) {
    // Check duplicate
    const existing = await prisma.courseEnrollment.findUnique({
      where: {
        participantId_courseId: { participantId, courseId },
      },
    });

    if (existing) {
      throw new Error("Participant already enrolled");
    }

    return prisma.courseEnrollment.create({
      data: { participantId, courseId },
    });
  },

  async getCourseEnrollments(courseId: string) {
    const items = await prisma.courseEnrollment.findMany({
      where: { courseId },
      include: {
        participant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    return items;
  },

  async bulkEnroll(courseId: string, participantIds: string[]) {
    if (!participantIds.length) {
      throw new Error("No participants provided");
    }

    // Check duplicates
    const existing = await prisma.courseEnrollment.findMany({
      where: {
        courseId,
        participantId: { in: participantIds },
      },
      select: { participantId: true },
    });

    const alreadyEnrolled = existing.map((e) => e.participantId);
    const newUsers = participantIds.filter((id) => !alreadyEnrolled.includes(id));

    if (!newUsers.length) {
      throw new Error("All selected participants already enrolled");
    }

    const result = await prisma.courseEnrollment.createMany({
      data: newUsers.map((pid) => ({ participantId: pid, courseId })),
      skipDuplicates: true,
    });

    return {
      enrolled: result.count,
      alreadyEnrolled,
    };
  },

  async remove(id: string) {
    return prisma.courseEnrollment.delete({
      where: { id },
    });
  },
};
