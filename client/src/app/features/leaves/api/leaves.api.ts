import { apiClient } from "../../../lib/api-client";

export const leavesApi = {
  getLeaves: (filters?: object) => apiClient.get("/leaves", filters),

  approveLeave: (id: string) => apiClient.put(`/leaves/${id}/approve`),

  rejectLeave: (id: string) => apiClient.put(`/leaves/${id}/reject`),
};
