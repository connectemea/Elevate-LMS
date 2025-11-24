// export interface Enrollment {
//   id: string;
//   courseId: string;
//   courseName: string;
//   progress: number;
//   enrolledAt: string;
// }
import { Enrollment } from "./enrollment";

export interface Participant {
  id: string;
  name: string;
  email: string;
  year: number;
  createdAt: string;
  enrollments: Enrollment[];
  sessionProgress?: any[]; 
}

export interface NewParticipantPayload {
  name: string;
  email: string;
  year: number;
}
