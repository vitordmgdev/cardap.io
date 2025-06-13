import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { env, JWT_SECRET_ENCODED } from "../env";
import AuthSchemas from "./auth.schema";
import AuthService from "./auth.service";
import { jwtVerify } from "jose";
import { JWTExpired, JWTInvalid } from "jose/errors";

export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "lax" : "strict",
  path: "/",
} as const;

const AuthController = {
  Register: async (
    request: FastifyRequest<{ Body: z.infer<typeof AuthSchemas.Register> }>,
    reply: FastifyReply
  ) => {
    const data = request.body;

    const { accessToken, refreshToken } = await AuthService.Register(data);

    return reply
      .setCookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 14,
      })
      .header("authorization",`Bearer ${accessToken}`)
      .status(201).send({ success: true, message: "Usuário criado com sucesso." });
  },

  Login: async (
    request: FastifyRequest<{ Body: z.infer<typeof AuthSchemas.Login> }>,
    reply: FastifyReply
  ) => {
    const data = request.body;

    const { id, username, imageUrl, emailVerifiedAt, createdAt, updatedAt } = await AuthService.Login(data);

    const { accessToken, refreshToken } = await AuthService.GetAuthTokens(id);

    return reply
    .setCookie("refreshToken", refreshToken, {
      ...cookieOptions,
    })
    .header("authorization", `Bearer ${accessToken}`)
    .status(200).send({ 
      success: true, 
      data: {
        username, imageUrl, emailVerifiedAt, createdAt, updatedAt
      }
    });
  },
  
  Refresh: async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies.refreshToken;

    if(!refreshToken) {
      return reply.send({ error: "Você não possuí um refreshToken" });
    }

    try {
      const payload = (await jwtVerify(refreshToken, JWT_SECRET_ENCODED)).payload;

      const id = payload.sub as string;
      
      const { accessToken } = await AuthService.GetAuthTokens(id);

      return reply
      .header("authorization", `Bearer ${accessToken}`)
      .status(200).send({ success: true });
    } catch(error) {
      if(error instanceof JWTInvalid) {
        return reply.status(401).send({ error: "RefreshToken inválido."})
      }

      if(error instanceof JWTExpired) {
        return reply.status(401).send({ error: "RefreshToken expirado."})
      }
    }
  },
};

export default AuthController;
