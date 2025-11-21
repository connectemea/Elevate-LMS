import { apiHandler } from "@/lib/api-handler";
import { enrollmentController } from "@/backend/controllers/enrollment.controller";

export const GET = apiHandler(async (_req, { params }) => {
  const { id } = await params;
    const list = await enrollmentController.getEnrollments(id);

  return { enrollments: list };
});


export const POST = apiHandler(async (req, { params }) => {
  const { id: courseId } = await params;
    const { participantIds } = await req.json();

    const result = await enrollmentController.bulkEnroll(courseId, participantIds);

    return { result };
});

export const DELETE = apiHandler(async (_req, { params }) => {
  const { id } = await params;
  await enrollmentController.remove(id);

  return { success: true };
});
