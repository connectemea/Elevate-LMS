export function mapCourseResponse(course: any) {
  return {
    id: course.id,
    name: course.name,
    description: course.description,
    categories: course.categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      orderIndex: cat.orderIndex,
      sessions: cat.sessions.map((s: any) => ({
        id: s.id,
        title: s.title,
        assetLink: s.assetLink,
        assetType: s.assetType,
        orderIndex: s.orderIndex,
        progress: s.userProgress ?? null,
      })),
    })),
  };
}

export function mapParticipantDetail(p: any) {
  return {
    ...p,
    enrollments: p.enrollments.map((e: any) => ({
      ...e,
      progress: e.progress ?? 0,
    })),
  };
}

