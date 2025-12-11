import { enrollmentService } from '@/backend/services/enrollment.service';
import { enrollmentValidation } from '@/backend/validations/enrollment.validation';

export const enrollmentController = {
  async enrollSingle(payload: any) {
    const validated = enrollmentValidation.single(payload);
    return await enrollmentService.singleEnroll(validated.courseId, validated.participantId);
  },

  async getEnrollments(courseId: string) {
    if (!courseId) throw new Error('courseId required');
    return await enrollmentService.getCourseEnrollments(courseId);
  },

  async bulkEnroll(courseId: string, payload: any) {
    if (!courseId) throw new Error('courseId required');
    
    const participantIds = enrollmentValidation.bulk(payload);
    return await enrollmentService.bulkEnroll(courseId, participantIds);
  },

  async remove(id: string) {
    if (!id) throw new Error('enrollmentId required');
    return await enrollmentService.remove(id);
  },

  async getStats(courseId: string) {
    if (!courseId) throw new Error('courseId required');
    return await enrollmentService.getEnrollmentStats(courseId);
  },
};