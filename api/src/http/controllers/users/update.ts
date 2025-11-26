import { FastifyRequest, FastifyReply } from "fastify";
import { makeUpdateUserProfileUseCase } from "@/use-cases/factories/make-update-user-profile-use-case";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { name, email, password } = request.body as any;

    console.log("PATCH /me - Recebido:", { name, email, password: password ? "***" : undefined, userId: request.user.sub });

    const updateUser = makeUpdateUserProfileUseCase();

    const { user } = await updateUser.execute({
      userId: request.user.sub,
      name,
      email,
      password,
    });

    console.log("PATCH /me - Sucesso:", { userId: user.id, name: user.name });

    return reply.status(200).send({ user: { ...user, password_hash: undefined } });
  } catch (error: any) {
    console.error("PATCH /me - Erro:", error?.message || error);
    return reply.status(400).send({ message: error?.message || "Erro ao atualizar perfil" });
  }
}
