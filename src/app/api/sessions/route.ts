import { SessionController } from "@/backend/controllers/session.controller";
import { apiHandler } from "@/lib/api-handler";

export const POST = apiHandler((req: Request) => SessionController.create(req));