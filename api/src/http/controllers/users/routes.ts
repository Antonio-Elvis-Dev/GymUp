import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { refresh } from "./refresh";
import { updateProfile } from "./update-profile";
import { uploadAvatar } from "./upload-avatar";
import { leaderboard } from "./leaderbord";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.patch("/token/refresh", refresh);

  // Authenticated
  app.get("/me", { onRequest: [verifyJWT] }, profile);

  app.patch("/me/profile", { onRequest: [verifyJWT] }, updateProfile);

  app.patch("/me/avatar", { onRequest: [verifyJWT] }, uploadAvatar);

  app.get('/leaderboard', { onRequest: [verifyJWT] }, leaderboard)
}
