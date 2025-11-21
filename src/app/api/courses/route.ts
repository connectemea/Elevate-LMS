import { apiHandler } from "@/lib/api-handler";
import { courseController } from "@/backend/controllers/course.controller";

export const GET = apiHandler(async () => {
  const data = await courseController.list();
  return { courses: data };
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const created = await courseController.create(body);
  return { course: created };
});
