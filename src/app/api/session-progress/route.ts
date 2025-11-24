import { sessionProgressController } from "@/backend/controllers/sessionProgress.controller";


export async function PUT(req: Request) {
  return sessionProgressController.update(req);
};