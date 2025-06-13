import { FastifyReply, FastifyRequest } from "fastify";
import { jwtVerify } from "jose";
import { JWT_SECRET_ENCODED } from "../env";
import { JWTExpired, JWTInvalid } from "jose/errors";

export default async function isAuthenticated(request: FastifyRequest, reply: FastifyReply) {
    const accessToken = request.headers.authorization?.split(" ")[1];

    if (!accessToken) {
        return reply.status(401).send({ error: "Não foi recebido um header authorization." });
    };

    try {
        await jwtVerify(accessToken, JWT_SECRET_ENCODED);
    } catch(error) {
        if(error instanceof JWTExpired) {
            return reply.status(401).send({ error: "Token expirado", refresh: true });
        };

        if(error instanceof JWTInvalid) {
            return reply.status(401).send({ error: "Token inválido", refresh: false });
        };
    };
};