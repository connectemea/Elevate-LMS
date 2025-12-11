export const sessionProgressValidation = {
  update: (data: any) => {
    const errors: string[] = [];

    if (!data?.sessionId || typeof data.sessionId !== 'string') {
      errors.push('Valid sessionId is required');
    }

    if (!data?.participantId || typeof data.participantId !== 'string') {
      errors.push('Valid participantId is required');
    }

    if (!data?.status || !['in_progress', 'completed'].includes(data.status)) {
      errors.push('Valid status is required (in_progress or completed)');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return {
      sessionId: data.sessionId,
      participantId: data.participantId,
      status: data.status,
    };
  },
};