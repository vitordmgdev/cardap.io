import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../libs/prisma";
import { AppError } from "../errors/app-error";

interface RegisterInterface  {
    username: string;
    email: string;
    password: string;
};

const UserRepository = {
    Register: async (data: RegisterInterface) => {
        return await prisma.user.create({
            data
        })
    },
    FindUserByEmail: async (email: string) => {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                username: true,
                password: true,
                emailVerifiedAt: true
            }
        });

        if(!user) {
            throw new AppError("NOT_FIND_USER", 404);
        }

        return user;
    }
}

export default UserRepository;