import { useQuery } from "@tanstack/react-query";
import { leavesApi } from "../api/leaves.api";

export const useLeaves = (filters: { status?: string; leaveType?: string }) => {
  return useQuery({
    queryKey: ["leaves", filters],
    queryFn: () => leavesApi.getLeaves(filters),
  });
};
