import { apiHandler } from "@/lib/api-handler";
import { categoryController } from "@/backend/controllers/category.controller";

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
    const created = await categoryController.create(body);

  return { category: created };
});
