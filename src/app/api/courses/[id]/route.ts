//   { params }: { params: Promise<{ id: string }> }
import { apiHandler } from "@/lib/api-handler";
import { courseController } from "@/backend/controllers/course.controller";

export const GET = apiHandler(async (req, { params }) => {
  const { id } = await params;

  const participantId = new URL(req.url).searchParams.get("participantId") ?? undefined;

  const data = await courseController.get(id, { participantId });
  return { course: data };
});

export const PATCH = apiHandler(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();

  const updated = await courseController.update(id, body);
  return updated;
});

export const DELETE = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  const deleted = await courseController.remove(id);
  return { deleted: true, id };
});
