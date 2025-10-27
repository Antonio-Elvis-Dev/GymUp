import { CheckIn } from  "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-erros";


interface CheckInUseCaseRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}
interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {

    constructor(
        private checkInsRepository: CheckInsRepository, // dependencia de checkIn
        private gymsRepository: GymsRepository // dependencia de gym
    ) { }

    async execute({
        gymId,
        userId,
        userLatitude,
        userLongitude
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {

        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
        )

        const MAX_DISTANCE_IN_KILOMETERS = 0.1 // 100 metros

        if (distance > MAX_DISTANCE_IN_KILOMETERS) { // 0.1 km = 100 metros
            throw new MaxDistanceError()
        }

        const checkInInSameDay = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date() // data atual
        )

        if (checkInInSameDay) {
            throw new MaxNumberOfCheckInsError()
        }

        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn,
        }
    }
}