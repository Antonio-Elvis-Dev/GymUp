import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UpdateUserProfileUseCase } from "./update-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { expect, describe, it, beforeEach } from "vitest";

let usersRepository: InMemoryUsersRepository;
let sut: UpdateUserProfileUseCase;

describe("Update User Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserProfileUseCase(usersRepository);
  });
  it("should be able to update user profile", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "john@example.com",
      password_hash: "123456",
    });
    const { user: updateUser } = await sut.execute({
      userId: user.id,
      name: `John Tre`,
      avatar: `avatar-update.png`,
    });

    expect(updateUser.name).toEqual("John Tre");
    expect(updateUser.avatar).toEqual(`avatar-update.png`);
  });

  it(`shold not be able to update a non-existing user`, async () => {
    await expect(() =>
      sut.execute({
        userId: `non-existing-id`,
        name: `John`,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
