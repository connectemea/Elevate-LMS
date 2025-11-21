import { sessionProgressController } from "@/backend/controllers/sessionProgress.controller";

export const POST = (req: Request) =>
  sessionProgressController.update(req);
