// backend/validations/category.validation.ts
export const categoryValidation = {
  create: (data: any) => {
    const errors: string[] = [];

    if (!data?.name || data.name.trim().length === 0) {
      errors.push('Category name is required');
    }

    if (!data?.courseId || typeof data.courseId !== 'string') {
      errors.push('Valid courseId is required');
    }

    if (data.orderIndex !== undefined && (isNaN(data.orderIndex) || data.orderIndex < 0)) {
      errors.push('Order index must be a non-negative number');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return {
      name: data.name.trim(),
      courseId: data.courseId,
      orderIndex: data.orderIndex !== undefined ? parseInt(data.orderIndex, 10) : 0,
    };
  },

  update: (data: any) => {
    const result: any = {};

    if (data.name !== undefined) {
      if (data.name.trim().length === 0) {
        throw new Error('Category name cannot be empty');
      }
      result.name = data.name.trim();
    }

    if (data.description !== undefined) {
      result.description = data.description?.trim() || null;
    }

    if (data.orderIndex !== undefined) {
      if (isNaN(data.orderIndex) || data.orderIndex < 0) {
        throw new Error('Order index must be a non-negative number');
      }
      result.orderIndex = parseInt(data.orderIndex, 10);
    }

    return result;
  },
};