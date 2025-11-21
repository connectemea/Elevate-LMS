import { ParticipantController } from "@/backend/controllers/participant.controller";

export const GET = () => ParticipantController.getAll();
export const POST = (req: Request) => ParticipantController.create(req);
