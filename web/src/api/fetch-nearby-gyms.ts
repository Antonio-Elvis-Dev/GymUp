import { api } from "@/lib/axios";

export interface Gym {
  id: string;
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  address: string | null; // Adicionado recentemente
}

interface FetchNearbyGymsParams {
  userLatitude: number;
  userLongitude: number;
}

export async function fetchNearbyGyms({ userLatitude, userLongitude }: FetchNearbyGymsParams) {
  const response = await api.get('/gyms/nearby', {
    params: {
      latitude: userLatitude,
      longitude: userLongitude
    }
  });

  return response.data.gyms as Gym[];
}