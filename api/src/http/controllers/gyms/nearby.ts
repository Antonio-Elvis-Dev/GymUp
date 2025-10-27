import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";


export async function nearby(request: FastifyRequest, reply: FastifyReply) {

    const createBodySchema = z.object({
        latitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        })
    })

    const { latitude, longitude } = createBodySchema.parse(request.query)


    const ferchNearbyUseCase = makeFetchNearbyGymsUseCase()

   const {gyms} = await ferchNearbyUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude
    })

    return reply.status(200).send({
        gyms
    })

} 