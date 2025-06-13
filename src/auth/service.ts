import bcrypt from "bcrypt";
import UserRepository from "../user/userRepository";
import { SignJWT } from "jose";
import { JWT_SECRET_ENCODED } from "../env";
import { AppError } from "../errors/app-error";

interface RegisterInterface {
    username: string;
    email: string;
    password: string;
};

interface GetAuthTokensInterface {
    accessToken: string;
    refreshToken: string;
};

interface LoginInterface {
    email: string;
    password: string;
}

const AuthService = {
    Register: async (data: RegisterInterface) => {
        data.password = bcrypt.hashSync(data.password, 12);

        const user = await UserRepository.Register(data);

        if(!user) {
            throw new AppError("Não foi possível cadastrar o seu usuário", 400);
        }

        return await AuthService.GetAuthTokens(user.id);
    },
    GetAuthTokens: async (id: string):Promise<GetAuthTokensInterface> => {
        const accessToken = await new SignJWT()
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime("1m").sign(JWT_SECRET_ENCODED);

        const refreshToken = await new SignJWT()
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime("14d").sign(JWT_SECRET_ENCODED);
        return { accessToken, refreshToken };
    },
    Login: async (data: LoginInterface) => {
        const { id, password } = await UserRepository.FindUserByEmail(data.email);

        const samePassword = bcrypt.compareSync(data.password, password);

        if(!samePassword) {
            throw new AppError("PASSWORD_ARE_INCORRECT", 401);
        }

        const { accessToken, refreshToken } = await AuthService.GetAuthTokens(id);

        return { accessToken, refreshToken, id };
    }
}

export default AuthService;