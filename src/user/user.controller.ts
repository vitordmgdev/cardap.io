import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "./user.service";

const UserController = {
    me: async (request: FastifyRequest, reply: FastifyReply) => {
        const id = request.userId;

        const user = await UserService.findUserById(id);

        return reply.status(200).send(user);
    }
}

export default UserController;