import { apiHandler } from "@/lib/api-handler";
import { courseController } from "@/backend/controllers/course.controller";

export const GET = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  const data = await courseController.getEnrollments(id);
  return data;
});

export const POST = apiHandler(async (req, { params }) => {
  const { id } = await params;
  const body = await req.json();

  const enrolled = await courseController.enrollParticipants(id, body.participantIds);
  return enrolled;
});
 
