import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourseEnrollments,
  enrollUsersInCourse, // you must create this in service
} from "@/services/course.service";

import { Enrollment } from "@/types";

export function useEnrollments(courseId: string) {
  const queryClient = useQueryClient();

  // FETCH enrollments
  const enrollmentsQuery = useQuery<Enrollment[]>({
    queryKey: ["enrollments", courseId],
    queryFn: () => getCourseEnrollments(courseId),
    enabled: !!courseId,
  });

  // MUTATION enroll users
  const enrollMutation = useMutation({
    mutationFn: (userIds: string[]) =>
      enrollUsersInCourse(courseId, userIds),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments", courseId] });
    },
  });

  return {
    ...enrollmentsQuery,

    enrollUsers: enrollMutation.mutate,
    enrolling: enrollMutation.isPending,
  };
}
