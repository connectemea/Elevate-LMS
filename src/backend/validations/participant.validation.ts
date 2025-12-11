// backend/validations/participant.validation.ts

export const participantValidation = {
  create: (data: any) => {
    const errors: string[] = [];

    if (!data?.name || typeof data.name !== "string" || data.name.trim().length === 0) {
      errors.push("Name is required");
    }

    if (!data?.email || typeof data.email !== "string" || !isValidEmail(data.email)) {
      errors.push("Valid email is required");
    }

    if (
      data?.year === undefined ||
      isNaN(Number(data.year)) ||
      Number(data.year) < 1900 ||
      Number(data.year) > 2100
    ) {
      errors.push("Valid year is required");
    }

    if (errors.length) throw new Error(errors.join(", "));

    return {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      year: Number(data.year),
    };
  },

  update: (data: any) => {
    const result: any = {};

    if (data.name !== undefined) {
      if (typeof data.name !== "string" || data.name.trim().length === 0) {
        throw new Error("Name cannot be empty");
      }
      result.name = data.name.trim();
    }

    if (data.email !== undefined) {
      if (typeof data.email !== "string" || !isValidEmail(data.email)) {
        throw new Error("Valid email is required");
      }
      result.email = data.email.trim().toLowerCase();
    }

    if (data.year !== undefined) {
      if (isNaN(Number(data.year)) || Number(data.year) < 1900 || Number(data.year) > 2100) {
        throw new Error("Valid year is required");
      }
      result.year = Number(data.year);
    }

    return result;
  },
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
