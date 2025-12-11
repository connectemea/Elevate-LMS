export const sessionValidation = {
  create: (data: any) => {
    const errors: string[] = [];

    if (!data?.categoryId || typeof data.categoryId !== 'string') {
      errors.push('Valid categoryId is required');
    }

    if (!data?.title || data.title.trim().length === 0) {
      errors.push('Session title is required');
    }

    if (!data?.assetLink || data.assetLink.trim().length === 0) {
      errors.push('Asset link is required');
    }

    if (!data?.assetType || !['youtube', 'web', 'pdf', 'other'].includes(data.assetType)) {
      errors.push('Valid assetType is required (youtube, web, pdf, other)');
    }

    if (data.orderIndex !== undefined && (isNaN(data.orderIndex) || data.orderIndex < 0)) {
      errors.push('Order index must be a non-negative number');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return {
      categoryId: data.categoryId,
      title: data.title.trim(),
      assetLink: data.assetLink.trim(),
      assetType: data.assetType,
      orderIndex: data.orderIndex !== undefined ? parseInt(data.orderIndex, 10) : 0,
    };
  },

  update: (data: any) => {
    const result: any = {};

    if (data.title !== undefined) {
      if (data.title.trim().length === 0) {
        throw new Error('Session title cannot be empty');
      }
      result.title = data.title.trim();
    }

    if (data.assetLink !== undefined) {
      if (data.assetLink.trim().length === 0) {
        throw new Error('Asset link cannot be empty');
      }
      result.assetLink = data.assetLink.trim();
    }

    if (data.assetType !== undefined) {
      if (!['youtube', 'web', 'pdf', 'other'].includes(data.assetType)) {
        throw new Error('Valid assetType is required (youtube, web, pdf, other)');
      }
      result.assetType = data.assetType;
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