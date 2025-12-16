import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";
import { UsersRepository } from "@/repositories/users-repository";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}
interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

dayjs.extend(weekOfYear);

export class ValidateCheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository, // dependencia de checkIn
    private usersRepository: UsersRepository
  ) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes"
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    const xpAmount = 50;
    checkIn.xpEarned = xpAmount;

    await this.checkInsRepository.save(checkIn);

    const user = await this.usersRepository.findById(checkIn.user_id);

    if (user) {
      user.xp += xpAmount;

      const today = dayjs(new Date());
      const currentWeekStr = `${today.year()}-${today.week()}`;
if (user.lastStreakWeek !== currentWeekStr) {
        const lastWeekDate = today.subtract(1, "week");
        const startOfLastWeek = lastWeekDate.startOf("week").toDate();
        const endOfLastWeek = lastWeekDate.endOf("week").toDate();

        const countLastWeek =
          await this.checkInsRepository.countByUserIdAndDateRange(
            user.id,
            startOfLastWeek,
            endOfLastWeek
          );

        if (countLastWeek < 3) {
          user.streak = 0;
        }

        user.lastStreakWeek = currentWeekStr;
      }

      user.streak += 1; 

      await this.usersRepository.save(user)
    }
    return {
      checkIn,
    };
  }
}
