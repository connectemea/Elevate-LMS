import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { participantService } from "@/services/participant.service";
import { message } from "antd";

export function useParticipants() {
  const queryClient = useQueryClient();
  const [messageApi] = message.useMessage();

  const query = useQuery({
    queryKey: ["participants"],
    queryFn: () => participantService.getAll(), 
    staleTime: 1000 * 60 * 2,
  });

  const addMutation = useMutation({
    mutationFn: participantService.create,
    onSuccess: () => {
      messageApi.success("Participant added");
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
    onError: (err: any) => {
      messageApi.error(err.message || "Failed to add participant");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: participantService.delete,
    onSuccess: () => {
      messageApi.success("Participant deleted");
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
    onError: () => {
      messageApi.error("Failed to delete participant");
    },
  });

  return {
    ...query,
    addParticipant: addMutation.mutate,
    deleteParticipant: deleteMutation.mutate,
    addLoading: addMutation.isPending,
    deleteLoading: deleteMutation.isPending,
  };
}
