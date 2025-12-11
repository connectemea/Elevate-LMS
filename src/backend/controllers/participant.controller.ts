// backend/controllers/participant.controller.ts
import { participantService } from "@/backend/services/participant.service";
import { participantValidation } from "@/backend/validations/participant.validation";

export const participantController = {
  async list() {
    return participantService.getAll();
  },

  async create(payload: any) {
    const data = participantValidation.create(payload);
    return participantService.create(data);
  },

  async get(id: string) {
    if (!id) throw new Error("Participant ID required");
    const participant = await participantService.getById(id);
    if (!participant) throw new Error("Participant not found");
    return participant;
  },

  async update(id: string, payload: any) {
    if (!id) throw new Error("Participant ID required");
    const data = participantValidation.update(payload);
    return participantService.update(id, data);
  },

  async remove(id: string) {
    if (!id) throw new Error("Participant ID required");
    return participantService.deleteById(id);
  },

  async bulkCreate(payload: any) {
    if (!payload || !Array.isArray(payload.participants)) {
      throw new Error("participants array is required");
    }
    const validated = payload.participants.map((p: any) =>
      participantValidation.create(p)
    );
    return participantService.bulkCreate(validated);
  },

  async getStatistics() {
    return participantService.getStatistics();
  },
};
