import { UsersRepository } from "@/repositories/users-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { expect, describe, it, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

// Unit Test - testes unitarios

let checkInsRepository: InMemoryCheckInsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: ValidateCheckInUseCase; // system under test

describe("Validate Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository, usersRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: "123456",
    });
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should creadit XP to the user upon validation ", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: "123456",
    });

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: user.id,
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });
    expect(checkIn.xpEarned).toBe(50);

    const updatedUser = await usersRepository.findById(user.id);
    expect(updatedUser?.xp).toBe(50);
  });

  it("should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
