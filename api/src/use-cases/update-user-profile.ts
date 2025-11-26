import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { User } from "@prisma/client";

interface UpdateUserProfileRequest {
  userId: string;
  name?: string;
  email?: string;
  password?: string;
}

interface UpdateUserProfileResponse {
  user: User;
}

export class UpdateUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, name, email, password }: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    const data: any = {};

    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (password !== undefined) {
      const password_hash = await hash(password, 6);
      data.password_hash = password_hash;
    }

    // Se nenhum campo foi fornecido, retorna erro
    if (Object.keys(data).length === 0) {
      throw new Error("Nenhum campo foi fornecido para atualização");
    }

    const user = await this.usersRepository.update(userId, data);

    return { user };
  }
}
