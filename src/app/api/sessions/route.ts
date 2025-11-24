import { SessionController } from "@/backend/controllers/session.controller";

export const POST = async (req: Request) => {
  return SessionController.create(req);
};

