import { app } from "@/app";

import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";

import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Update User Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it("should be able to update user profile data", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .put("/me/profile")
      .set("Authorization", `Bearer ${token} `)
      .send({
        name: 'John Updated',
        avatar: 'http://exemplo.com/avatar.jpg'

      })


      expect(response.statusCode).toEqual(200)
      expect(response.body.user).toEqual(
        expect.objectContaining({
            name:'John Updated',
            avatar: 'http://exemple.com/avatar.jpg'
        })

      )
  });
});
