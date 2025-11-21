import { ParticipantController } from "@/backend/controllers/participant.controller";
import { apiHandler } from "@/lib/api-handler";

export const GET = apiHandler(async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  return ParticipantController.get(id);
});

export const PUT = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  return ParticipantController.update(id, req);
});

export const DELETE = apiHandler(async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  return ParticipantController.remove(id);
});
