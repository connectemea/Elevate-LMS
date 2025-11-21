export async function fetchParticipant(id: string) {
  const res = await fetch(`/api/participants/${id}`);
  if (!res.ok) throw new Error("Failed to fetch participant");
  return res.json();
}

export async function fetchParticipantCourse(courseId: string, participantId: string) {
  const res = await fetch(`/api/courses/${courseId}?participantId=${participantId}`);
  if (!res.ok) throw new Error("Failed to fetch course");
  return res.json();
}

export async function updateSessionProgress(payload: {
  sessionId: string;
  participantId: string;
  status: "in_progress" | "completed";
}) {
  const res = await fetch(`/api/session-progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update progress");
  return res.json();
}
