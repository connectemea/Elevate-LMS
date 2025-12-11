import { sessionService } from '@/backend/services/session.service';
import { sessionValidation } from '@/backend/validations/session.validation';

export const sessionController = {
  async create(payload: any) {
    const validated = sessionValidation.create(payload);
    return await sessionService.create(validated);
  },

  async update(id: string, payload: any) {
    if (!id) throw new Error('Session ID required');
    
    const validated = sessionValidation.update(payload);
    return await sessionService.update(id, validated);
  },

  async remove(id: string) {
    if (!id) throw new Error('Session ID required');
    return await sessionService.delete(id);
  },

  async get(id: string, participantId?: string) {
    if (!id) throw new Error('Session ID required');
    
    const session = await sessionService.getById(id, participantId);
    if (!session) throw new Error('Session not found');
    
    return session;
  },

  async reorder(categoryId: string, payload: any) {
    if (!categoryId) throw new Error('Category ID required');
    
    if (!Array.isArray(payload.sessionIds)) {
      throw new Error('sessionIds array is required');
    }
    
    return await sessionService.reorder(categoryId, payload.sessionIds);
  },

  async getByCategory(categoryId: string, participantId?: string) {
    if (!categoryId) throw new Error('Category ID required');
    return await sessionService.getByCategory(categoryId, participantId);
  },

  async updateProgress(sessionId: string, participantId: string, payload: any) {
    if (!sessionId) throw new Error('Session ID required');
    if (!participantId) throw new Error('Participant ID required');
    
    if (!payload.status || !['in_progress', 'completed'].includes(payload.status)) {
      throw new Error('Valid status is required (in_progress or completed)');
    }
    
    return await sessionService.updateProgress(sessionId, participantId, payload.status);
  },
};