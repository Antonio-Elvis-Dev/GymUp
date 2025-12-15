import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface CreateGymUseCaseRequest {
  title: string;
  address: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  rating: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}
export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    description,
    phone,
    title,
    latitude,
    longitude,
    address,
    rating,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      description,
      phone,
      title,
      latitude,
      longitude,
      address,
      rating
    });

    return { gym };
  }
}
