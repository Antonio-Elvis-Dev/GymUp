import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchLeaderboardUseCase } from "@/use-cases/factories/make-fetch-leaderboard-use-case";

export async function leaderboard(request: FastifyRequest, reply: FastifyReply) {
    const leaderboardQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    })

    const { page } = leaderboardQuerySchema.parse(request.query)

    const fetchLeaderboardUseCase = makeFetchLeaderboardUseCase()

    const { users } = await fetchLeaderboardUseCase.execute({
        page,
    })

    // Retorna os usuários sem o hash da senha
    return reply.status(200).send({
        users: users.map(user => ({
            ...user,
            password_hash: undefined
        }))
    })
}