import prisma from "@/backend/db/prisma";

export const categoryService = {
  async create(data: { name: string; orderIndex: number; courseId: string }) {
    return prisma.courseCategory.create({ data });
  },

  async update(
    id: string,
    data: { name?: string; description?: string; orderIndex?: number }
  ) {
    return prisma.courseCategory.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.courseCategory.delete({
      where: { id },
    });
  },

  async getById(id: string) {
    return prisma.courseCategory.findUnique({ where: { id } });
  }
};
