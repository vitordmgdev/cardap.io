import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import RestaurantRepository from "./restaurantRepository";
import RestaurantSchema from "./restaurantSchema";

const RestaurantController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const data = RestaurantSchema.create.parse(request.body);

    const restaurant = await RestaurantRepository.create(request.userId, data);

    return reply.status(201).send({ restaurant });
  },
  getByUserId: async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.userId;

    const restaurants = await RestaurantRepository.getByUserId(userId);

    return reply.status(200).send(restaurants);
  },
  getBySlug: async (
    request: FastifyRequest<{
      Params: z.infer<typeof RestaurantSchema.getBySlug>;
    }>,
    reply: FastifyReply
  ) => {
    const { slug } = request.params;

    const restaurant = await RestaurantRepository.getBySlug(slug);

    return reply.status(200).send(restaurant);
  },
};

export default RestaurantController;
