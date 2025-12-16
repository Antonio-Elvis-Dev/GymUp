import { FetchGymCheckInsUseCase } from './../fetch-gym-check-ins';

import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"

export function makeFetchGymCheckInsUseCase() {


    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new FetchGymCheckInsUseCase(checkInsRepository)

    return useCase
}