import { api } from "@/lib/axios";

export interface CheckInAdmin {
  id: string;
  created_at: string;
  validated_at: string | null;
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
}

// Buscar check-ins da academia
export async function fetchGymCheckIns(gymId: string) {
  const response = await api.get<{ checkIns: CheckInAdmin[] }>(`/gyms/${gymId}/check-ins`);
  return response.data.checkIns;
}

// Validar um check-in específico
export async function validateCheckIn(checkInId: string) {
  await api.patch(`/check-ins/${checkInId}/validate`);
}