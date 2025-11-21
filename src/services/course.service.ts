// src/services/course.service.ts

export async function getCourses() {
  const res = await fetch("/api/courses");
  if (!res.ok) throw new Error("Failed to fetch courses");
  const data = await res.json();
  return data.courses ?? data;
}

export async function createCourse(payload: { name: string; description: string }) {
  const res = await fetch("/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create course");
  return res.json();
}

export async function deleteCourse(id: string) {
  const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete course");
  return res.json();
}

export async function getCourseDetail(id: string) {
  const res = await fetch(`/api/courses/${id}`);
  if (!res.ok) throw new Error("Failed to load course");
  return (await res.json()).course;
}

export async function getCourseEnrollments(id: string) {
  const res = await fetch(`/api/courses/${id}/enrollments`);
  if (!res.ok) throw new Error("Failed to load enrollments");
  return await res.json();
}

export async function getAvailableUsers(id: string) {
  const res = await fetch(`/api/courses/${id}/available-users`);
  if (!res.ok) throw new Error("Failed to load users");
  return await res.json();
}

export async function enrollUsersInCourse(courseId: string, ids: string[]) {
  const res = await fetch(`/api/enrollments/${courseId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ participantIds: ids }),
  });

  if (!res.ok) throw new Error("Failed to enroll users");

  return res.json();
}
