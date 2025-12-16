import { api } from "@/lib/axios";

export interface CheckInHistory {
  id: string;
  created_at: string;
  validated_at: string | null;
  gym_id: string;
  gym: {
    title: string;
  };
}

export async function fetchCheckInHistory(page = 1) {
  const response = await api.get<{ checkIns: CheckInHistory[] }>('/check-ins/history', {
    params: { page }
  });

  return response.data.checkIns;
}