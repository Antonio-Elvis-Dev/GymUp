import { api } from "@/lib/axios";

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string | null;
  xp: number;
  streak: number;
}

export async function fetchLeaderboard(page = 1) {
  const response = await api.get<{ users: LeaderboardUser[] }>('/leaderboard', {
    params: { page }
  });

  return response.data.users;
}