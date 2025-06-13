import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AppError } from "../errors/app-error";
import prisma from "../libs/prisma";

const UserService = {
    findUserById: async (id: string) => {
        try {
            return await prisma.user.findUniqueOrThrow({
                where: { id },
                select: {
                    username: true,
                    email: true,
                    emailVerifiedAt: true,
                    imageUrl: true,
                    createdAt: true
                }
            });
        } catch(err) {
            if(err instanceof PrismaClientKnownRequestError) {
                if(err.code === "P2025") {
                    throw new AppError("Não foi possível encontrar este usuário", 404);
                };
            };
        };
    }
}

export default UserService;