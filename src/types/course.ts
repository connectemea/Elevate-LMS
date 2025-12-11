import { Category } from "./category";

export interface Course {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[];

  _count?: {
    enrollments: number;
  };

  // UI editing fields
  isEditing?: boolean;
  tempName?: string;
  tempDescription?: string;
}

export interface CourseCreateDTO {
  name: string;
  description?: string | null;
}

export interface CourseUpdateDTO {
  name?: string;
  description?: string | null;
}

export interface EnrollDTO {
  participantIds: string[];
}

