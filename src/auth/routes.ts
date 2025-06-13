import RefreshMiddleware from "../middlewares/refresh";
import { FastifyTypedInstance } from "../types";
import AuthController from "./controller";
import AuthSchemas from "./schema";

export const AuthRoutes = (app: FastifyTypedInstance) => {
  app.post(
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Register account",
        body: AuthSchemas.Register,
      },
    },
    AuthController.Register
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Authenticate user",
        body: AuthSchemas.Login,
      },
    },
    AuthController.Login
  );

  app.get(
    "/refresh",
    {
      preHandler: [RefreshMiddleware],
      schema: {
        tags: ["auth"],
        summary: "Get new access token",
      },
    },
    AuthController.Refresh
  );
};
