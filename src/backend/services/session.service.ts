// src/backend/services/session.service.ts
import prisma from "@/backend/db/prisma";
import { AssetType } from "@prisma/client";


export const sessionService = {
  /* -------------------------------------------------------------------------- */
  /*                                   CREATE                                   */
  /* -------------------------------------------------------------------------- */
  async create(payload: {
    categoryId: string;
    title: string;
    assetLink: string;
    assetType: AssetType;
    orderIndex: number;
  }) {
    const { categoryId, title, assetLink, assetType, orderIndex } = payload;

    return prisma.session.create({
      data: {
        categoryId,
        title,
        assetLink,
        assetType,
        orderIndex,
      },
      include: {
        category: {
          include: { course: true },
        },
      },
    });
  },

  /* -------------------------------------------------------------------------- */
  /*                                   UPDATE                                   */
  /* -------------------------------------------------------------------------- */
  async update(
    id: string,
    payload: {
      title?: string;
      assetLink?: string;
      assetType?: AssetType;
      orderIndex?: number;
    },
  ) {
    return prisma.session.update({
      where: { id },
      data: {
        ...(payload.title && { title: payload.title }),
        ...(payload.assetLink && { assetLink: payload.assetLink }),
        ...(payload.assetType && { assetType: payload.assetType }),
        ...(payload.orderIndex !== undefined && { orderIndex: payload.orderIndex }),
      },
      include: {
        category: {
          include: { course: true },
        },
      },
    });
  },

  /* -------------------------------------------------------------------------- */
  /*                                   DELETE                                   */
  /* -------------------------------------------------------------------------- */
  async delete(id: string) {
    return prisma.session.delete({
      where: { id },
    });
  },
};
