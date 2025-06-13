import isAuthenticated from "../middlewares/isAuthenticated";
import { FastifyTypedInstance } from "../types";
import RestaurantController from "./restaurant.controller";
import RestaurantSchema from "./restaurant.schema";

export const RestaurantRoutes = (app: FastifyTypedInstance) => {
  app.get("/", {
    preHandler: [isAuthenticated],
    schema: {
      tags: ["restaurant"],
      summary: "Get restaurant by userId"
    }
  }, RestaurantController.getByUserId);
  
  //Público
  app.get("/:slug", {
    schema: {
      tags: ["restaurant"],
      summary: "Get restaurant by restaurant slug",
      params: RestaurantSchema.getBySlug
    }
  }, RestaurantController.getBySlug);

  app.post("/", {
    preHandler: [isAuthenticated],
    schema: {
      tags: ["restaurant"],
      summary: "Create a Restaurant",
      body: RestaurantSchema.create
    }
  }, RestaurantController.create);

  app.delete("/:restaurantId", {
    preHandler: isAuthenticated,
    schema: {
      tags: ["restaurant"],
      summary: "Delete restaurant by restaurantId",
      params: RestaurantSchema.deleteByRestaurantId
    }
  }, RestaurantController.deleteByRestaurantId);
};
