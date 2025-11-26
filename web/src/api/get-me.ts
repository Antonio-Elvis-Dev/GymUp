import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export interface GetMeResponse {
  id: string;
  email: string;
  name: string;
  password_hash?: string | null;
  role: "ADMIN" | "MEMBER";
  created_at: string;
}

export async function getMe(): Promise<GetMeResponse | null> {
  try {
    const response = await api.get("/me");

    // API returns { user: { ... } }
    return response.data?.user ?? null;
  } catch (error) {
    // propagate error for caller to handle
    throw error as AxiosError;
  }
}
