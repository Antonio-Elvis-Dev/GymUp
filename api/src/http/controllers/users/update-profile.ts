import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateUserProfileUseCase } from "@/use-cases/factories/make-update-user-profile-use-case";

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const updateProfileBodySchema = z.object({
    name: z.string().optional(),
    avatar: z.string().optional(),
  });

  const { name, avatar } = updateProfileBodySchema.parse(request.body);

  const updateUserProfile = makeUpdateUserProfileUseCase();

  const { user } = await updateUserProfile.execute({
    userId: request.user.sub,
    name,
    avatar,
  });

  return reply.status(200).send({
    user: {
      ...user,
      passwork_hash: undefined,
    },
  });
}
