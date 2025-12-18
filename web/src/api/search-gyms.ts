import { api } from "@/lib/axios";

interface SearchGymsParams {
  query: string;
  page: number;
}

interface SearchGymsResponse {
  gyms: {
    id: string;
    title: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
  }[];
}

export async function searchGyms({ query, page }: SearchGymsParams): Promise<SearchGymsResponse> {
  // O backend espera 'q' na query string, mapeamos 'query' para 'q' aqui
  const response = await api.get('/gyms/search', {
    params: {
      q: query,
      page,
    },
  });

  return response.data;
}