import { categoryService } from '@/backend/services/category.service';
import { categoryValidation } from '@/backend/validations/category.validation';

export const categoryController = {
  async create(payload: any) {
    const validated = categoryValidation.create(payload);
    return await categoryService.create(validated);
  },

  async update(id: string, payload: any) {
    if (!id) throw new Error('Category ID required');
    
    const validated = categoryValidation.update(payload);
    return await categoryService.update(id, validated);
  },

  async remove(id: string) {
    if (!id) throw new Error('Category ID required');
    return await categoryService.delete(id);
  },

  async get(id: string) {
    if (!id) throw new Error('Category ID required');
    
    const category = await categoryService.getById(id);
    if (!category) throw new Error('Category not found');
    
    return category;
  },

  async reorder(courseId: string, payload: any) {
    if (!courseId) throw new Error('Course ID required');
    
    if (!Array.isArray(payload.categoryIds)) {
      throw new Error('categoryIds array is required');
    }
    
    return await categoryService.reorder(courseId, payload.categoryIds);
  },

  async getByCourse(courseId: string) {
    if (!courseId) throw new Error('Course ID required');
    return await categoryService.getByCourse(courseId);
  },
};