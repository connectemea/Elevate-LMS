import { sessionProgressController } from "@/backend/controllers/sessionProgress.controller";
import { apiHandler } from "@/lib/api-handler";

export const POST = apiHandler((req: Request) =>
  sessionProgressController.update(req));