import { enrollmentController } from "@/backend/controllers/enrollment.controller";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
    const list = await enrollmentController.getEnrollments(id);

  return { enrollments: list };
};


export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params;
    const { participantIds } = await req.json();

    const result = await enrollmentController.bulkEnroll(courseId, participantIds);

    return { result };
};


export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await enrollmentController.remove(id);

  return { success: true };
};
