import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { env } from "../env";
import AuthSchemas from "./schema";
import AuthService from "./service";

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
      .setCookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60,
      })
      .status(201)
      .send({ success: true });
  },
  Login: async (
    request: FastifyRequest<{ Body: z.infer<typeof AuthSchemas.Login> }>,
    reply: FastifyReply
  ) => {
    const data = request.body;

    const { accessToken, refreshToken, id } = await AuthService.Login(data);

    return reply
      .setCookie("refreshToken", refreshToken, {
        ...cookieOptions,
      })
      .setCookie("accessToken", accessToken, {
        ...cookieOptions,
      })
      .send({ success: true, userId: id })
      .status(200);
  },
  Refresh: async (request: FastifyRequest, reply: FastifyReply) => {
    const { accessToken } = await AuthService.GetAuthTokens(request.userId);

    return reply
      .setCookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60,
      })
      .send({ success: true })
      .status(200);
  },
};

export default AuthController;
