import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);
    if (!user) {
      return null;
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);
    if (!user) {
      return null;
    }
    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
      avatar: null,
      xp: 0,
      role: "MEMBER" as const,
      streak: 10,
      lastStreakWeek: null
    };
    this.items.push(user);
    return user;
  }

  async updateXp(userId: string, newXp: number) {
    return;
  }
  async save(user: User) {
    const userIndex = this.items.findIndex((item) => item.id === user.id);
    if (userIndex >= 0) {
      this.items[userIndex] = user;
    }
    return user;
  }

  async findManyTopXp(page: number) {
    return this.items
      .sort((a, b) => b.xp - a.xp) // Ordena do maior para o menor
      .slice((page - 1) * 20, page * 20); // Paginação
  }
}
