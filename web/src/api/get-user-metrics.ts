import { api } from "@/lib/axios";

interface GetUserMetricsResponse {
  checkInsCount: number;
}

export async function getUserMetrics() {
  const response = await api.get<GetUserMetricsResponse>('/check-ins/metrics');
  return response.data;
}