import isAuthenticatedMiddleware from "../middlewares/isAuthenticated";
import UserSchema from "./userSchema";
import { FastifyTypedInstance } from "../types";
import UserController from "./userController";

export const UserRoutes = (app: FastifyTypedInstance) => {
  app.get(
    "/me/:id",
    {
      preHandler: [isAuthenticatedMiddleware],
      schema: {
        tags: ["user"],
        description: "Get user by id",
        params: UserSchema.me,
      },
    },
    UserController.me
  );
};
