import { SessionController } from "@/backend/controllers/session.controller";
import { apiHandler } from "@/lib/api-handler";

export const PUT = apiHandler(async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  return SessionController.update(id, req);
});

export const DELETE = apiHandler(async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  return SessionController.remove(id);
});
