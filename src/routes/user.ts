import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyTypedInstance } from "../types";
import z from "zod";
import { randomUUID } from "node:crypto";

interface User {
    id: string;
    name: string,
    email: string
}

export const UserRoutes = (app: FastifyTypedInstance) => {
    const users: User[] = []

    app.get("/users", {
        schema: {
            tags: ["users"],
            description: "Get all users",
            response: {
                200: z.array(
                    z.object({
                        id: z.string(),
                        name: z.string(),
                        email: z.string()
                    })
                ).describe("List of users")
            }
        }
    }, (reply) => {
        return users;
    })

    app.post("/register", {
        schema: {
            tags: ["users"],
            description: "Create a new user",
            body: z.object(
                {
                    name: z.string(),
                    email: z.string().email()
                }
            ),
            response: {
                201: z.null().describe("User created"),
            }
        }
    }, (request, reply) => {
        const { name, email } = request.body;

        users.push({
            id: randomUUID(),
            email,
            name
        });

        reply.status(201).send();

    })
}