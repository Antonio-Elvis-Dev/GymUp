import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export interface RegisterPayLoad {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: "ADMIN" | "MEMBER";
  created_at: Date;
}

export async function registerUser(
  data: RegisterPayLoad
): Promise<RegisterResponse> {
  try {
    const response = await api.post("/users", data);

    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
}
