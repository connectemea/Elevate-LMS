import prisma from "@/backend/db/prisma";

export const categoryService = {
  async create(data: { name: string; orderIndex?: number; courseId: string }) {
    const exists = await prisma.course.findUnique({
      where: { id: data.courseId },
      select: { id: true },
    });
    if (!exists) throw new Error("Course not found");

    let orderIndex = data.orderIndex;
    if (orderIndex === undefined) {
      const last = await prisma.courseCategory.findFirst({
        where: { courseId: data.courseId },
        orderBy: { orderIndex: "desc" },
        select: { orderIndex: true },
      });
      orderIndex = last ? last.orderIndex + 1 : 0;
    }

    return prisma.courseCategory.create({
      data: { ...data, orderIndex },
      select: {
        id: true,
        name: true,
        orderIndex: true,
        createdAt: true,
        _count: { select: { sessions: true } },
      },
    });
  },

  update(id: string, data: { name?: string; orderIndex?: number }) {
    return prisma.courseCategory.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.courseCategory.delete({
      where: { id },
    });
  },

  /**
   * Reordering categories
   */
  async reorder(courseId: string, orderedIds: string[]) {
    const updates = orderedIds.map((id, index) =>
      prisma.courseCategory.update({
        where: { id },
        data: { orderIndex: index },
      })
    );
    return prisma.$transaction(updates);
  },

  getByCourse(courseId: string) {
    return prisma.courseCategory.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
      include: {
        _count: { select: { sessions: true } },
      },
    });
  },
};
