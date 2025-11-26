import { api } from "@/lib/axios";
import { AxiosError } from "axios";

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  avatarFile?: File | null;
}

export async function updateProfile(data: UpdateProfilePayload) {
  try {
    // If avatarFile present, send multipart/form-data
    if (data.avatarFile) {
      const form = new FormData();
      if (data.name !== undefined) form.append("name", data.name);
      if (data.email !== undefined) form.append("email", data.email);
      if (data.password !== undefined) form.append("password", data.password);
      form.append("avatar", data.avatarFile);

      const response = await api.patch("/me", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data?.user ?? response.data;
    }

    // Otherwise send JSON
    const payload: Record<string, any> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.email !== undefined) payload.email = data.email;
    if (data.password !== undefined) payload.password = data.password;

    const response = await api.patch("/me", payload);

    return response.data?.user ?? response.data;
  } catch (error) {
    throw error as AxiosError;
  }
}
