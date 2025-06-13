import isAuthenticated from "../middlewares/isAuthenticated";
import { FastifyTypedInstance } from "../types";
import UserController from "./user.controller";

export const UserRoutes = (app: FastifyTypedInstance) => {
  app.get("/me",{
    preHandler: [isAuthenticated],
    schema: {
      tags: ["user"],
      description: "Get user by id"
    }
  }, UserController.me);
};
