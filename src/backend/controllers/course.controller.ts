import { courseService } from "@/backend/services/course.service";
import { courseValidation } from "@/backend/validations/course.validation";

export const courseController = {
  list() {
    return courseService.getAll();
  },

  create(body: any) {
    const data = courseValidation.create(body);
    return courseService.create(data);
  },

  async get(id: string, participantId?: string) {
    const course = await courseService.getById(id, participantId);
    if (!course) throw new Error("Course not found");
    return course;
  },

  update(id: string, body: any) {
    const data = courseValidation.update(body);
    return courseService.update(id, data);
  },

  remove(id: string) {
    return courseService.delete(id);
  },

  getEnrollments(id: string) {
    return courseService.getEnrollments(id);
  },

  getAvailableUsers(id: string) {
    return courseService.getAvailableUsers(id);
  },

  enroll(id: string, body: any) {
    const ids = courseValidation.enroll(body);
    return courseService.bulkEnroll(id, ids);
  }
};
