import { enrollmentService } from "@/backend/services/enrollment.service";

export const enrollmentController = {
  async enrollSingle(payload: { courseId: string; participantId: string }) {
    if (!payload.courseId || !payload.participantId) {
      throw new Error("courseId & participantId required");
    }
    return enrollmentService.singleEnroll(payload.courseId, payload.participantId);
  },

  async getEnrollments(courseId: string) {
    if (!courseId) throw new Error("courseId required");
    return enrollmentService.getCourseEnrollments(courseId);
  },

  async bulkEnroll(courseId: string, participantIds: string[]) {
    if (!courseId) throw new Error("courseId required");
    return enrollmentService.bulkEnroll(courseId, participantIds);
  },

  async remove(id: string) {
    if (!id) throw new Error("enrollmentId required");
    return enrollmentService.remove(id);
  },
};
