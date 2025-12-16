import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchGymCheckInsUseCase } from "@/use-cases/factories/make-fetch-gym-check-ins-use-case";

export async function checkIns(request: FastifyRequest, reply: FastifyReply) {
    const querySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    })
    const paramsSchema = z.object({
        gymId: z.string().uuid(),
    })

    const { page } = querySchema.parse(request.query)
    const { gymId } = paramsSchema.parse(request.params)

    const fetchGymCheckInsUseCase = makeFetchGymCheckInsUseCase()
    const { checkIns } = await fetchGymCheckInsUseCase.execute({ gymId, page })

    return reply.status(200).send({ checkIns })
}