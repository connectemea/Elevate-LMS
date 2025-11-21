import { useQuery } from "@tanstack/react-query";
import { fetchParticipant, fetchParticipantCourse } from "@/services/participant-course.service";

export function useParticipantCourse(participantId: string, courseId: string) {
  const participantQuery = useQuery({
    queryKey: ["participant", participantId],
    queryFn: () => fetchParticipant(participantId),
  });

  const courseQuery = useQuery({
    queryKey: ["participant-course", participantId, courseId],
    queryFn: () => fetchParticipantCourse(courseId, participantId),
  });

  return {
    participant: participantQuery.data?.participant,
    course: courseQuery.data?.course,
    loading: participantQuery.isLoading || courseQuery.isLoading,
    refetchCourse: courseQuery.refetch,
  };
}
