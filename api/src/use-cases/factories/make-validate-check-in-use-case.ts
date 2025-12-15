import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ValidateCheckInUseCase } from "../validate-check-in";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository();

  const usersRepository = new PrismaUsersRepository();
  const useCase = new ValidateCheckInUseCase(
    checkInRepository,
    usersRepository
  );

  return useCase;
}
