import { api } from "@/lib/axios";
import { AxiosError } from "axios";

interface CheckInParams {
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

export interface CheckInResponse {
  id: string;
  createdAt: string;
  validatedAt?: string | null;

  gym: {
    id: string;
    title: string;
  };
}

export async function createCheckIn({
  gymId,
  userLatitude,
  userLongitude,
}: CheckInParams) {
  const response = await api.post(`/gyms/${gymId}/check-ins`, {
    userLatitude,
    userLongitude,
  });

  return response.data;
}
