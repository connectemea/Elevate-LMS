import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSessionProgress } from "@/services/participant-course.service";

export function useUpdateSessionProgress(participantId: string, courseId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateSessionProgress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["participant-course", participantId, courseId] });
    },
  });
}
