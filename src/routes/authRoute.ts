import { FastifyTypedInstance } from "../types";
import z from "zod";
import AuthController from "../controllers/authController";
import AuthSchemas from "../schemas/authSchema";

export const AuthRoutes = (app: FastifyTypedInstance) => {
    app.post("/register", {
        schema: {
            tags: ["auth"],
            description: "Register account",
            body: AuthSchemas.register,
            response: {
                201: z.object(
                    { 
                        message: z.string(), 
                        data: z.object({
                            otpExpires: z.date(),
                            email: z.string()
                        })
                    }
                ).describe("Account created successfully"),
                409: z.object(
                    { error: z.string() }
                ).describe("Already exists user with this email"),
                500: z.object(
                    { error: z.string() }
                ).describe("There was an error registering the user")
            }
        }
    }, AuthController.register);

    app.post("/login", {
        schema: {
           tags: ["auth"],
            description: "Login user",
            body: AuthSchemas.login
        }
    }, AuthController.login);

    app.post("/verify", {
        schema: {
            tags: ["auth"],
            description: "Verify account",
            body: AuthSchemas.verify
        }
    }, AuthController.verify);
}