import cookie from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import dotenv from "dotenv";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { AppError } from "./errors/app-error";
import { RestaurantRoutes } from "./restaurant/restaurantRoutes";
import { AuthRoutes } from "./auth/routes";
import { UserRoutes } from "./user/userRoutes";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

dotenv.config();

const app = fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: true,
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

app.register(cookie, {
  secret: env.COOKIE_SECRET,
});

app.setValidatorCompiler(validatorCompiler);

app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Cardap.io",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(fastifyCors, {
  origin: "http://localhost:3000", // ou seu domínio do front
  credentials: true,
});

app.register(AuthRoutes, {
  prefix: "/api/auth",
});

app.register(UserRoutes, {
  prefix: "/api/user",
});

app.register(RestaurantRoutes, {
  prefix: "/api/restaurant",
});

app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ error: error.message });
  }

  // Log para debug (ajuda em produção)
  request.log.error(error);
});

const PORT = 3334;

app.listen(
  {
    port: PORT,
  },
  () => console.log(`Server running on port ${PORT}`)
);
