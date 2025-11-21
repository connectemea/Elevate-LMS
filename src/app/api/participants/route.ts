import { ParticipantController } from "@/backend/controllers/participant.controller";
import { apiHandler } from "@/lib/api-handler";

export const GET = apiHandler(() => ParticipantController.getAll());
export const POST = apiHandler((req: Request) => ParticipantController.create(req));