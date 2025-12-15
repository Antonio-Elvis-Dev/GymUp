import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { tr } from "zod/v4/locales";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49";

interface UpdateUserProfileUseCaseRequest {
  userId: string;
  name?: string | undefined;
  avatar?: string | undefined;
}

interface UpdateUserProfileUseCaseResponse {
  user: User;
}

export class UpdateUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}
  async execute({
    userId,
    name,
    avatar,
  }: UpdateUserProfileUseCaseRequest): Promise<UpdateUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }
    const updateUser = await this.userRepository.save(user);
    return { user: updateUser };
  }
}
