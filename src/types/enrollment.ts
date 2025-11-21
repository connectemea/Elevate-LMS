export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  completedSessions: number;
  totalSessions: number;
  progress: number;
  enrolledAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
