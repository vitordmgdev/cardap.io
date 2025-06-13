import z from "zod";

const AuthSchemas = {
    Register: z.object({
        username: z.string().max(50).toLowerCase(),
        email: z.string().email().toLowerCase(),
        password: z.string().min(8).max(20)
    }),
    Login: z.object({
        email: z.string().email().toLowerCase(),
        password: z.string().min(8).max(20)
    })
};

export default AuthSchemas;