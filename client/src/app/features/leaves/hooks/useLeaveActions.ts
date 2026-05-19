import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leavesApi } from "../api/leaves.api";

export const useApproveLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leavesApi.approveLeave,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });
    },
  });
};

export const useRejectLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leavesApi.rejectLeave,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });
    },
  });
};
