import { Prisma, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }

  async updateXp(userId: string, newXp: number): Promise<void> {
    await prisma.user.update({
        where: { id: userId },
        data: { xp: newXp }
    })
  }

  async save(data: User) {
    
    const { id, created_at, ...updateData } = data;

    const user = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: updateData, 
    });

    return user;
  }
  async findManyTopXp(page: number): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: {
        xp: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return users;
  }
}
