import { User } from "@prisma/client";
import { UsersRepository } from "@/repositories/users-repository";

interface FetchLeaderboardUseCaseRequest {
    page: number
}

interface FetchLeaderboardUseCaseResponse {
    users: User[]
}

export class FetchLeaderboardUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        page
    }: FetchLeaderboardUseCaseRequest): Promise<FetchLeaderboardUseCaseResponse> {
        const users = await this.usersRepository.findManyTopXp(page)

        return {
            users,
        }
    }
}