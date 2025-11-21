// src/backend/controllers/course.controller.ts

import { courseService } from "@/backend/services/course.service";

export const courseController = {
  /* -------------------------------------------------------------------------- */
  /*                                   LIST                                     */
  /* -------------------------------------------------------------------------- */
  async list() {
    return courseService.getAll();
  },

  /* -------------------------------------------------------------------------- */
  /*                                   CREATE                                   */
  /* -------------------------------------------------------------------------- */
  async create(payload: { name: string; description?: string }) {
    if (!payload?.name) throw new Error("Name is required");
    return courseService.create(payload);
  },

  /* -------------------------------------------------------------------------- */
  /*                                   GET ONE                                  */
  /* -------------------------------------------------------------------------- */
  async get(id: string, opts?: { participantId?: string }) {
    if (!id) throw new Error("Course ID required");

    const course = await courseService.getById(id, opts?.participantId);
    if (!course) throw new Error("Course not found");

    return course;
  },

  /* -------------------------------------------------------------------------- */
  /*                                  UPDATE                                    */
  /* -------------------------------------------------------------------------- */
  async update(id: string, data: { name?: string; description?: string }) {
    if (!id) throw new Error("Course ID required");
    return courseService.update(id, data);
  },

  /* -------------------------------------------------------------------------- */
  /*                                  DELETE                                    */
  /* -------------------------------------------------------------------------- */
  async remove(id: string) {
    if (!id) throw new Error("Course ID required");
    return courseService.deleteById(id);
  },

  /* -------------------------------------------------------------------------- */
  /*                              ENROLLMENTS                                   */
  /* -------------------------------------------------------------------------- */
  async getEnrollments(courseId: string) {
    if (!courseId) throw new Error("Course ID required");
    return courseService.getEnrollments(courseId);
  },

  async getAvailableUsers(courseId: string) {
    if (!courseId) throw new Error("Course ID required");
    return courseService.getAvailableUsers(courseId);
  },

  async enrollParticipants(courseId: string, participantIds: string[]) {
    if (!courseId) throw new Error("Course ID required");
    if (!participantIds?.length) throw new Error("No participants selected");

    return courseService.bulkEnroll(courseId, participantIds);
  },
};
