import { apiHandler } from "@/lib/api-handler";
import { categoryController } from "@/backend/controllers/category.controller";

export const PUT = apiHandler(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();

  const updated = await categoryController.update(id, body);
  return { category: updated };
});

export const DELETE = apiHandler(async (_req, { params }) => {
  const { id } = await params;

  await categoryController.remove(id);
  return { deleted: true, id };
});
