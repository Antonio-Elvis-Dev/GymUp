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

  avatar?: string;    
  xp: number;            
  streak: number;        
  totalCheckIns: number; 
  gymsVisited: number;   
  badges: string[];
}

export async function getMe(token:string): Promise<GetMeResponse> {
  try {
    const response = await api.get("/me", {
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
    return response.data.user;
  } catch (error) {
    throw error as AxiosError;
  }
}


