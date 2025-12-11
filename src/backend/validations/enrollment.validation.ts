export const enrollmentValidation = {
  single: (data: any) => {
    if (!data?.courseId || typeof data.courseId !== 'string') {
      throw new Error('Valid courseId is required');
    }
    if (!data?.participantId || typeof data.participantId !== 'string') {
      throw new Error('Valid participantId is required');
    }
    return {
      courseId: data.courseId,
      participantId: data.participantId,
    };
  },

  bulk: (data: any) => {
    if (!Array.isArray(data?.participantIds)) {
      throw new Error('participantIds must be an array');
    }
    if (data.participantIds.length === 0) {
      throw new Error('At least one participant is required');
    }
    
    const invalidIds = data.participantIds.filter((id: any) => typeof id !== 'string');
    if (invalidIds.length > 0) {
      throw new Error('All participant IDs must be strings');
    }
    
    return data.participantIds;
  },
};