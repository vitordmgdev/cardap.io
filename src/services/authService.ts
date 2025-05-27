import bcrypt from "bcrypt";
import { AppError } from "../errors/app-error";
import jwt from "jsonwebtoken";
import { env } from "../env";
import prisma from "../libs/prisma";
import crypto from "crypto"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface CreateUserInterface {
    name: string;
    email: string;
    hashedPassword: string;
    otpCode: string;
};

interface LoginInterface {
    email: string;
    password: string;
}

interface VerifyAccountInterface {
    email: string;
    otpCode: string;
};

const AuthService = {
    generateOtpCode: () => {
        return crypto.randomInt(100000, 999999).toString();
    },
    hashPassword: async(password: string) => {
        return bcrypt.hashSync(password, 12);
    },
    createUser: async(
        { name, email, hashedPassword, otpCode }:CreateUserInterface
    ) => {
        try {
            const OTPexpiresIn = 5 * 60 * 1000;

            const user = await prisma.user.create({
                data: {
                    name, email, password: hashedPassword, 
                    otpCode: otpCode, 
                    otpExpires: new Date(Date.now() + OTPexpiresIn)
                },
                select: {
                    otpExpires: true
                }
            });

            return user;
        } catch(err) {
            if(err instanceof PrismaClientKnownRequestError) {
                if(err.code === "P2002") {
                    throw new AppError("Este email já está em uso", 409);
                }
                throw err;
            };
            throw err;
        };
    },
    login: async(
        { email, password }:LoginInterface
    ) => {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    password: true
                }
            })

            if(!user) {
                throw new AppError("Usuário não encontrado", 404);
            }

            if(!bcrypt.compareSync(password, user.password)) {
                throw new AppError("A senha está incorreta", 409);
            }

            const accessToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
                expiresIn: "1h"
            })

            const refreshToken = jwt.sign({ id: user.id }, env.JWT_SECRET, {
                expiresIn: "7d"
            })

            return { accessToken, refreshToken };
        } catch(err) {
            throw err;
        }
    },
    verifyAccount: async(
        { email, otpCode }:VerifyAccountInterface
    ) => {
        try {
            const user = await prisma.user.findFirst({
                where: { 
                    email, 
                    otpCode, 
                    otpExpires: {
                        gte: new Date()
                    } 
                }
            });

            if(!user) {
                throw new AppError("Código inválido ou expirado.", 400);
            }

            return await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerifiedAt: new Date(),
                    otpCode: null,
                    otpExpires: null
                }
            })
        } catch(err) {
            if(err instanceof PrismaClientKnownRequestError) {
                if(err.code === "P2025") {
                    throw new AppError("Não encontramos um usuário com este email");
                }
            }
            throw err;
        }
    }
}

export default AuthService;