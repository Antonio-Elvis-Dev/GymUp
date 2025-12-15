import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { FetchLeaderboardUseCase } from "../fetch-leaderboard"

export function makeFetchLeaderboardUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new FetchLeaderboardUseCase(usersRepository)

  return useCase
}