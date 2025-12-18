import { api } from "@/lib/axios";

export interface CreateGymBody {
  title: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
}

export async function createGym(data: CreateGymBody) {
  await api.post("/gyms", data);
}