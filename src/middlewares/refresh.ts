import { FastifyReply, FastifyRequest } from "fastify";
import { jwtVerify } from "jose";
import { JWTExpired, JWTInvalid } from "jose/errors";
import { cookieOptions } from "../auth/controller";
import { JWT_SECRET_ENCODED } from "../env";
import { AppError } from "../errors/app-error";

export default async function RefreshMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const refreshToken = request.cookies.refreshToken;

  if (!refreshToken) {
    return reply.status(401).send({ error: "JWT_TOKEN_MISSING" });
  }

  try {
    const { sub } = (await jwtVerify(refreshToken, JWT_SECRET_ENCODED)).payload;

    if (!sub) {
      throw new AppError("JWT_MISSING_SUB", 401);
    }

    request.userId = sub;
  } catch (err) {
    if (err instanceof JWTExpired) {
      reply.setCookie("refreshToken", "", {
        ...cookieOptions,
        expires: new Date(0),
      });

      return reply.status(401).send({ error: "JWT_EXPIRED_TOKEN" });
    }

    if (err instanceof JWTInvalid) {
      return reply
        .status(401)
        .send({ error: "JWT_INVALID_TOKEN" })
        .setCookie("refreshToken", "", {
          ...cookieOptions,
          expires: new Date(0),
        });
    }
  }
}
