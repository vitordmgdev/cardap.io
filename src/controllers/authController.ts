import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import AuthSchemas from "../schemas/authSchema";
import AuthService from "../services/authService";
import EmailService from "../services/emailService";
import { env } from "../env";

const AuthController = {
    register: async(
        request: FastifyRequest<{Body: z.infer<typeof AuthSchemas.register>}>,
        reply: FastifyReply
    ) => {
        const { name, email, password } = request.body;
        const hashedPassword = await AuthService.hashPassword(password);
        const otpCode = AuthService.generateOtpCode();

        const user = await AuthService.createUser({ 
            name, 
            email, 
            hashedPassword,
            otpCode
        });

        await EmailService.verifyEmail({ otpCode, receiver: email, otpExpires: user?.otpExpires });

        return reply.code(201).send({ 
            message: "O usuário foi criado com sucesso",
            data: {
                otpExpires: user?.otpExpires,
                email
            }
        });
    },
    login: async(
        request: FastifyRequest<{Body: z.infer<typeof AuthSchemas.login>}>,
        reply: FastifyReply
    ) => {
        const { email, password } = request.body;
        const { accessToken, refreshToken } = await AuthService.login({ email, password });
        
        reply.setCookie("access", accessToken, {
            maxAge: 60 * 60,
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: env.NODE_ENV === "production" ? "lax" : "none"
        });

        reply.setCookie("refresh", refreshToken, {
            maxAge: 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: env.NODE_ENV === "production" ? "lax" : "none"
        });

        return reply.code(200).send({ message: "Você foi autenticado com sucesso" });
    },
    verify: async(
        request: FastifyRequest<{Body: z.infer<typeof AuthSchemas.verify>}>,
        reply: FastifyReply
    ) => {
        const { otpCode, email } = request.body;
        await AuthService.verifyAccount({ email, otpCode });

        return reply.code(201).send({ message: "Conta verificada com sucesso" });
    }
}

export default AuthController;