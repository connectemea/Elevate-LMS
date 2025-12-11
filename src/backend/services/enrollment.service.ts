import prisma from "@/backend/db/prisma";

export const enrollmentService = {
  async singleEnroll(courseId: string, participantId: string) {
    // Validate existence
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new Error("Course not found");

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });
    if (!participant) throw new Error("Participant not found");

    // Prevent duplicate
    const existing = await prisma.courseEnrollment.findUnique({
      where: { participantId_courseId: { participantId, courseId } },
    });
    if (existing) throw new Error("Already enrolled");

    return prisma.courseEnrollment.create({
      data: { participantId, courseId },
      include: {
        participant: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  async getCourseEnrollments(courseId: string) {
    return prisma.courseEnrollment.findMany({
      where: { courseId },
      orderBy: { enrolledAt: "desc" },
      include: {
        participant: {
          select: { id: true, name: true, email: true, year: true },
        },
      },
    });
  },

  /**
   * Fast, unique bulk-enroll
   */
  async bulkEnroll(courseId: string, participantIds: string[]) {
    if (!participantIds.length) throw new Error("No participants provided");

    const result = await prisma.courseEnrollment.createMany({
      data: participantIds.map((id) => ({
        courseId,
        participantId: id,
      })),
      skipDuplicates: true,
    });

    return result;
  },

  remove(id: string) {
    return prisma.courseEnrollment.delete({ where: { id } });
  },

  async getEnrollmentStats(courseId: string) {
    const [totalEnrolled, recentEnrollments] = await Promise.all([
      prisma.courseEnrollment.count({ where: { courseId } }),
      prisma.courseEnrollment.findMany({
        where: { courseId },
        take: 5,
        orderBy: { enrolledAt: "desc" },
        include: {
          participant: { select: { name: true, email: true } },
        },
      }),
    ]);

    return { totalEnrolled, recentEnrollments };
  },
};
