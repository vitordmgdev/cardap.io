import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import RestaurantRepository from "./restaurant.service";
import RestaurantSchema from "./restaurant.schema";
import RestaurantService from "./restaurant.service";

const RestaurantController = {
  create: async (
    request: FastifyRequest<{ Body: z.infer<typeof RestaurantSchema.create> }>, 
    reply: FastifyReply
  ) => {
    const data = request.body;

    const restaurant = await RestaurantRepository.create(request.userId, data);

    return reply.status(201).send({ success: true, restaurant });
  },
  deleteByRestaurantId: async (
    request: FastifyRequest<{
      Params: z.infer<typeof RestaurantSchema.deleteByRestaurantId>
    }>, 
    reply: FastifyReply
  ) => {
    const { restaurantId } = request.params;

    await RestaurantService.deleteByRestaurantId(restaurantId);

    return reply.status(200).send({ success: true });
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
