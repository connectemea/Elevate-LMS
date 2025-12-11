import prisma from "@/backend/db/prisma";
import { AssetType } from "@prisma/client";

export const sessionService = {
  async create(data: {
    categoryId: string;
    title: string;
    assetLink: string;
    assetType: AssetType;
    orderIndex?: number;
  }) {
    const exists = await prisma.courseCategory.findUnique({
      where: { id: data.categoryId },
      select: { id: true },
    });
    if (!exists) throw new Error("Category not found");

    let orderIndex = data.orderIndex;
    if (orderIndex === undefined) {
      const last = await prisma.session.findFirst({
        where: { categoryId: data.categoryId },
        orderBy: { orderIndex: "desc" },
        select: { orderIndex: true },
      });
      orderIndex = last ? last.orderIndex + 1 : 0;
    }

    return prisma.session.create({
      data: { ...data, orderIndex },
      select: {
        id: true,
        title: true,
        assetLink: true,
        assetType: true,
        orderIndex: true,
        categoryId: true,
      },
    });
  },

  update(id: string, data: any) {
    return prisma.session.update({
      where: { id },
      data,
    });
  },

  delete(id: string) {
    return prisma.session.delete({ where: { id } });
  },

  async getById(id: string, participantId?: string) {
    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
            course: { select: { id: true, name: true } },
          },
        },
        ...(participantId && {
          progress: {
            where: { participantId },
            select: { status: true, updatedAt: true },
          },
        }),
      },
    });

    if (!session) return null;

    return {
      ...session,
      userProgress: participantId ? session.progress?.[0] ?? null : null,
      progress: undefined,
    };
  },

  async reorder(categoryId: string, sessionIds: string[]) {
    const tx = sessionIds.map((id, index) =>
      prisma.session.update({
        where: { id },
        data: { orderIndex: index },
      })
    );
    return prisma.$transaction(tx);
  },

  async getByCategory(categoryId: string, participantId?: string) {
    const list = await prisma.session.findMany({
      where: { categoryId },
      orderBy: { orderIndex: "asc" },
      include: {
        progress: participantId
          ? {
              where: { participantId },
              select: { status: true, updatedAt: true },
            }
          : {
              select: { status: true, updatedAt: true }, 
            },
      },
    });

    return list.map((s) => ({
      id: s.id,
      title: s.title,
      assetLink: s.assetLink,
      assetType: s.assetType,
      orderIndex: s.orderIndex,
      createdAt: s.createdAt,
      userProgress: s.progress.length ? s.progress[0] : null,
    }));
  },
};
