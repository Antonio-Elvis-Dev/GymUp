import { User, Prisma } from "@prisma/client";
export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  save(user: User): Promise<User>;
  updateXp(userId: string, newXp: number): Promise<void>;
  findManyTopXp(page: number): Promise<User[]>;
}
