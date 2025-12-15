import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export interface CheckInResponse {
  id: string;
  createdAt: string;
  validatedAt?: string | null;

  gym: {
    id: string;
    title: string;
  };
}

export async function checkIn(token:string): Promise<CheckInResponse> {
  try {
    const response = await api.get("/gyms/:gymId/check-ins", {
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    return response.data.user;
  } catch (error) {
    throw error as AxiosError;
  }
}


