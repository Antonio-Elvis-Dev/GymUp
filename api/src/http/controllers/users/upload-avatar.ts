import { FastifyRequest, FastifyReply } from "fastify";

import { makeUpdateUserProfileUseCase } from "@/use-cases/factories/make-update-user-profile-use-case";
import { randomUUID } from "node:crypto";

import fs from "node:fs";
import path, { dirname } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { env } from "@/env";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function uploadAvatar(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = await request.file();

  if (!data) {
    return reply.status(400).send({ message: "No file uploaded." });
  }

  if (!data.mimetype) {
    return reply.status(400).send({
      message: "File type not provided.",
    });
  }

  const fileType = data.mimetype.split("/")[1];
  if (!["png", "jpg", "jpeg", "webp"].includes(fileType)) {
    return reply
      .status(400)
      .send({ message: "Invalid file type. Only images are allowed." });
  }

  const uploadDir = path.resolve(__dirname, "..", "..", "..", "..", "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const getUserProfile = makeGetUserProfileUseCase();
  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  });
  if (user.avatar) {
    const oldFileName = user.avatar.split("/").pop();

    if (oldFileName) {
      const oldFilePath = path.join(uploadDir, oldFileName);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
  }

  const fileName = `${randomUUID()}.${fileType}`;
  const filePath = path.join(uploadDir, fileName);

  await pipeline(data.file, fs.createWriteStream(filePath));

  const avatarUrl = `${env.APP_BASE_URL}/uploads/${fileName}`;
  const updateUserProfile = makeUpdateUserProfileUseCase();

  await updateUserProfile.execute({
    userId: request.user.sub,
    avatar: avatarUrl,
  });

  return reply.status(200).send({
    avatarUrl,
  });
}
