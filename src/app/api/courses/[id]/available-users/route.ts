import { apiHandler } from "@/lib/api-handler";
import { courseController } from "@/backend/controllers/course.controller";

export const GET = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  const users = await courseController.getAvailableUsers(id);
  return users;
});

