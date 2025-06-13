import bcrypt from "bcrypt";
import UserRepository from "../user/user.repository";
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
};

const AuthService = {
    Register: async (data: RegisterInterface) => {
        data.password = bcrypt.hashSync(data.password, 12);

        const { id } = await UserRepository.Register(data);

        return await AuthService.GetAuthTokens(id);
    },
    
    GetAuthTokens: async (id: string):Promise<GetAuthTokensInterface> => {
        const accessToken = await new SignJWT({ 
            sub: id 
        })
        .setProtectedHeader({ 
            alg: "HS256" 
        }).setExpirationTime("1h")
        .sign(JWT_SECRET_ENCODED);

        const refreshToken = await new SignJWT({ 
            sub: id 
        })
        .setProtectedHeader({ 
            alg: "HS256" 
        })
        .setExpirationTime("14d")
        .sign(JWT_SECRET_ENCODED);

        return { accessToken, refreshToken };
    },

    Login: async (data: LoginInterface) => {
        const user = await UserRepository.FindUserByEmail(data.email);

        const samePassword = bcrypt.compareSync(data.password, user.password);

        if(!samePassword) {
            throw new AppError("As senhas não coincidem.", 401);
        }

        return user;
    }
}

export default AuthService;