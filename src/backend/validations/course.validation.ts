import {
  CourseCreateDTO,
  CourseUpdateDTO,
  EnrollDTO,
} from "@/types/course";

export const courseValidation = {
  create(data: any): CourseCreateDTO {
    if (!data?.name || typeof data.name !== "string") {
      throw new Error("Name is required");
    }

    return {
      name: data.name.trim(),
      description: data.description?.trim() || null,
    };
  },

  update(data: any): CourseUpdateDTO {
    const result: CourseUpdateDTO = {};

    if (data.name !== undefined) {
      if (typeof data.name !== "string") throw new Error("Invalid name");
      result.name = data.name.trim();
    }

    if (data.description !== undefined) {
      result.description = data.description?.trim() || null;
    }

    return result;
  },

  enroll(data: any): string[] {
    if (!Array.isArray(data.participantIds)) {
      throw new Error("participantIds must be an array");
    }

    return data.participantIds;
  }
};
