import fastify from "fastify";
import { z, ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { usersRoutes } from "./http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";
import fastifyCookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import fs from "node:fs";

import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { LateCheckInValidationError } from "@/use-cases/errors/late-check-in-validation-error";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"; 
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

export const app = fastify();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

app.register(fastifyStatic, {
  root: uploadsPath,
  prefix: '/uploads/',
});

app.register(cors, {
   origin: "http://localhost:8080",
  methods: ["GET", "POST","PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  // sign: {
  //   expiresIn: "10m",
  // },
});


app.register(fastifyMultipart)



app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      issues: error.format(),
    });
  }
if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message });
  }

  if (error instanceof LateCheckInValidationError) {
    return reply.status(400).send({ message: error.message });
  }
    
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    return reply.status(400).send({ message: error.message });
  }
  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // Here you can integrate with an external service like Sentry/Datadog/NewRelic
    // to log errors in production environment
  }

  return reply.status(500).send({
    message: "Internal server error.",
  });
});
