import isAuthenticatedMiddleware from "../middlewares/isAuthenticated";
import { FastifyTypedInstance } from "../types";
import RestaurantController from "./restaurantController";
import RestaurantSchema from "./restaurantSchema";

export const RestaurantRoutes = (app: FastifyTypedInstance) => {
  app.post(
    "/",
    {
      preHandler: [isAuthenticatedMiddleware],
      schema: {
        tags: ["restaurant"],
        body: RestaurantSchema.create,
      },
    },
    RestaurantController.create
  );

  app.get(
    "/",
    {
      preHandler: [isAuthenticatedMiddleware],
      schema: {
        tags: ["restaurant"],
      },
    },
    RestaurantController.getByUserId
  );

  app.get(
    "/:slug",
    {
      schema: {
        tags: ["restaurant"],
        params: RestaurantSchema.getBySlug,
      },
    },
    RestaurantController.getBySlug
  );
};
