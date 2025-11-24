import { SessionController } from "@/backend/controllers/session.controller";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return SessionController.update(id, req);
};

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return SessionController.remove(id);
};