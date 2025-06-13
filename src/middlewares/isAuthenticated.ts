import { FastifyReply, FastifyRequest } from "fastify";
import { jwtVerify } from "jose";
import { JWT_SECRET_ENCODED } from "../env";

export default async function isAuthenticatedMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
        return reply.status(401).send({ error: "NOT_RECEIVED_TOKENS" });
    }

    try {
        await jwtVerify(accessToken, JWT_SECRET_ENCODED);
    } catch {
        return reply.status(401).send({ error: "INVALID_OR_EXPIRED_TOKEN" });
    }
};