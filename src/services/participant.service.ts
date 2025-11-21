import { api } from "./api";


export async function getParticipants() {
  const res = await fetch("/api/participants");
  if (!res.ok) throw new Error("Failed to fetch participants");
  const data = await res.json();
  return data.participants;
}

export async function createParticipant(payload: {
  name: string;
  email: string;
  year: number;
}) {
  const res = await fetch("/api/participants", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add participant");

  return data.participant;
}

export async function deleteParticipant(id: string) {
  const res = await fetch(`/api/participants/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete participant");
  return true;
}


export const participantService = {
  get: (id: string) => api.get(`/participants/${id}`),
  update: (id: string, data: any) => api.put(`/participants/${id}`, data),
  enroll: (data: any) => api.post(`/enrollments`, data),
  unenroll: (id: string) => api.delete(`/enrollments/${id}`),
  getCourses: () => api.get(`/courses`),
};
