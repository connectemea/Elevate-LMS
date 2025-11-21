import { categoryService } from "@/backend/services/category.service";

export const categoryController = {
  async create(payload: {
    name: string;
    orderIndex: number;
    courseId: string;
  }) {
    if (!payload?.name) throw new Error("Name required");
    if (!payload?.courseId) throw new Error("courseId required");

    return categoryService.create(payload);
  },

  async update(
    id: string,
    payload: { name?: string; description?: string; orderIndex?: number }
  ) {
    if (!id) throw new Error("Category ID required");

    return categoryService.update(id, payload);
  },

  async remove(id: string) {
    if (!id) throw new Error("Category ID required");

    return categoryService.delete(id);
  },
};
