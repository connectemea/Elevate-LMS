import { useQuery } from "@tanstack/react-query";
import { getCourseDetail, getCourseEnrollments, getAvailableUsers } from "@/services/course.service";

export function useCourseDetail(courseId: string) {
  const courseQuery = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseDetail(courseId),
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["enrollments", courseId],
    queryFn: () => getCourseEnrollments(courseId),
  });

  const usersQuery = useQuery({
    queryKey: ["availableUsers", courseId],
    queryFn: () => getAvailableUsers(courseId),
  });

  return {
    course: courseQuery.data,
    enrollments: enrollmentsQuery.data,
    availableUsers: usersQuery.data,

    loading: courseQuery.isLoading || enrollmentsQuery.isLoading,

    refetchCourse: courseQuery.refetch,
    refetchEnrollments: enrollmentsQuery.refetch,
  };
}
