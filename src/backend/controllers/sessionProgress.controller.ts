import { sessionProgressService } from '@/backend/services/sessionProgress.service';
import { sessionProgressValidation } from '@/backend/validations/sessionProgress.validation';

export const sessionProgressController = {
  async update(payload: any) {
    const validated = sessionProgressValidation.update(payload);
    return await sessionProgressService.updateProgress(
      validated.sessionId,
      validated.participantId,
      validated.status
    );
  },

  async getSessionProgress(sessionId: string, participantId: string) {
    if (!sessionId) throw new Error('Session ID required');
    if (!participantId) throw new Error('Participant ID required');
    
    return await sessionProgressService.getSessionProgress(sessionId, participantId);
  },

  async getCourseProgress(participantId: string, courseId: string) {
    if (!participantId) throw new Error('Participant ID required');
    if (!courseId) throw new Error('Course ID required');
    
    return await sessionProgressService.getCourseProgress(participantId, courseId);
  },

  async bulkUpdate(participantId: string, payload: any) {
    if (!participantId) throw new Error('Participant ID required');
    
    if (!Array.isArray(payload.updates)) {
      throw new Error('updates array is required');
    }
    
    return await sessionProgressService.bulkUpdateProgress(participantId, payload.updates);
  },
};