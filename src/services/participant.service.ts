export const participantService = {
  // List all participants
  getAll: async () => {
    const res = await fetch("/api/participants");
    const data = await res.json();
    return data.participants ?? []; // ✔ always return array
  },

  // Create a participant
  create: async (payload: { name: string; email: string; year: number }) => {
    const res = await fetch("/api/participants", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add participant");

    return data.participant;
  },

  // Delete participant
  delete: async (id: string) => {
    const res = await fetch(`/api/participants/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete participant");
    return true;
  },

  // Single participant
  get: async (id: string) => {
    const res = await fetch(`/api/participants/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Participant not found");
    return data;
  },

  // Update participant
  update: async (id: string, data: any) => {
    const res = await fetch(`/api/participants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.error || "Failed to update participant");
    return responseData.participant;
  },

  enroll: async (data: any) => {
    const res = await fetch(`/api/enrollments`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const responseData = await res.json();
    if (!res.ok)
      throw new Error(responseData.error || "Failed to enroll participant");
    return responseData.enrollment;
  },

  unenroll: async (id: string) => {
    const res = await fetch(`/api/enrollments/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to unenroll participant");
    return true;
  },

  getCourses: async () => {
    const res = await fetch(`/api/courses`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch courses");
    return data.courses ?? [];
  },
};
