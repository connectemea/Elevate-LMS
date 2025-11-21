import { useQuery } from "@tanstack/react-query";
import { participantService } from "@/services/participant.service";

export function useParticipantDetail(id: string) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["participant", id],
    queryFn: () => participantService.get(id),
  });

  return {
    participant: data?.participant,
    enrollments: data?.participant?.enrollments || [],
    progressHistory: data?.participant?.sessionProgress || [],
    stats: {
      totalEnrollments: data?.participant?.enrollments.length || 0,
      completedCourses: data?.participant?.enrollments.filter((e: any) => e.progress === 100).length,
      averageProgress:
        Math.round(
          (data?.participant?.enrollments.reduce((acc: number, e: any) => acc + e.progress, 0) || 0) /
          (data?.participant?.enrollments.length || 1)
        ),
    },
    courses: data?.courses || [],
    loading: isLoading,
    refetch,
  };
}
