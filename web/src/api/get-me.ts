import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export interface GetMeResponse {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: "ADMIN" | "MEMBER";
  created_at: Date;
}

export async function getMe(user): Promise<GetMeResponse> {
  try {
    const response = await api.get("/me", {
      auth: user.token,
    });
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
}
