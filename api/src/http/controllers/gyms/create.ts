import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
    address: z.string(),
  });

  const { description, latitude, longitude, phone, title, address } =
    createBodySchema.parse(request.body);

  // console.log(description)

  const creategymUseCase = makeCreateGymUseCase();

  await creategymUseCase.execute({
    title,
    description,
    longitude,
    latitude,
    phone,
    address,
    rating: 5,
  });

  return reply.status(201).send();
}
