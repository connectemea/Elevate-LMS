import { SessionController } from "@/backend/controllers/session.controller";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  return SessionController.update(params.id, req);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  return SessionController.remove(params.id);
}
