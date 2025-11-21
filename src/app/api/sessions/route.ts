import { SessionController } from "@/backend/controllers/session.controller";

export async function POST(req: Request) {
  return SessionController.create(req);
}
