import { CheckIn, User } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchGymCheckInsUseCaseRequest {
    gymId: string
    page: number
}

interface FetchGymCheckInsUseCaseResponse {
    checkIns: (CheckIn & { user: User })[]
}

export class FetchGymCheckInsUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({ gymId, page }: FetchGymCheckInsUseCaseRequest): Promise<FetchGymCheckInsUseCaseResponse> {
        // O cast 'as any' é necessário aqui pois o tipo de retorno do repositório 
        // agora inclui o 'user', mas a interface base do Prisma nem sempre reflete isso automaticamente sem tipos gerados
        const checkIns = await this.checkInsRepository.findManyByGymId(gymId, page) as (CheckIn & { user: User })[]

        return { checkIns }
    }
}