import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler, 
    serializerCompiler, 
    ZodTypeProvider, 
    jsonSchemaTransform 
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { AuthRoutes } from "./routes/authRoute";
import { AppError } from "./errors/app-error";
import cookie from "@fastify/cookie";
import { env } from "./env";
import dotenv from "dotenv";

dotenv.config()

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.register(cookie, {
    secret: env.COOKIE_SECRET 
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Cardap.io",
            version: "1.0.0"
        }
    },
    transform: jsonSchemaTransform
});

app.register(fastifySwaggerUi, {
    routePrefix: "/docs"
});

app.register(fastifyCors, {
    origin: "*"
});

app.register(AuthRoutes, {
    prefix: "/auth"
});

app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
        return reply.status(error.statusCode).send({ error: error.message });
    };

    // Log para debug (ajuda em produção)
    request.log.error(error);
});

app.listen({
    port: 3334
}, () => console.log("HTTP server"));