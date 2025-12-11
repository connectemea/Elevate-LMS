// app/api/courses/[id]/available-users/route.ts
import { apiHandler } from "@/lib/api-handler";
import { courseController } from "@/backend/controllers/course.controller";

type Params = {
  id: string;
};

export const GET = apiHandler<Params>(async (_req, { params }) => {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: "Course ID required" }, { status: 400 });
  }

  const users = await courseController.getAvailableUsers(id);
  return Response.json(users);
});