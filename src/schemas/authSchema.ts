import z from "zod";

const AuthSchemas = {
    register: z.object(
        {
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(8).max(20),
        }
    ),
    login: z.object(
        {
            email: z.string().email(),
            password: z.string().min(8).max(20)
        }
    ),
    verify: z.object(
        {
            email: z.string().email(),
            otpCode: z.string()
        }
    )
}

export default AuthSchemas;