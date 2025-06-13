import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "./userServices";

const UserController = {
    me: async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };

        const user = await UserService.findUserById(id);

        return reply.status(200).send(user);
    }
}

export default UserController;