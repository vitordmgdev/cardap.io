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
        const user = await prisma.user.create({
            data
        });

        if(!user) {
            throw new AppError("Não foi possível criar sua conta.", 400)
        }

        return user;
    },
    FindUserByEmail: async (email: string) => {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if(!user) {
            throw new AppError("Usuário não foi encontrado.", 404);
        }

        return user;
    }
}

export default UserRepository;