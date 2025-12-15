import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export interface GymsResponse {
  id: string;
  title: string;
  description?: string;
  phone?: string;
  latitude: number;
  longitude: number;

  members?: number;
  rating?: number;
  distance?: number;
}

export async function searchGyms(token: string): Promise<GymsResponse> {
  try {
    const response = await api.get("/gyms/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (error) {
    throw error as AxiosError;
  }
}
