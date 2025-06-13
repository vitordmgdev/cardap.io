import { FastifyTypedInstance } from "../types";
import AuthController from "./auth.controller";
import AuthSchemas from "./auth.schema";

export const AuthRoutes = (app: FastifyTypedInstance) => {
  app.post("/register", {
    schema: {
      tags: ["auth"],
      summary: "Register account",
      body: AuthSchemas.Register,
    }
  }, AuthController.Register);

  app.post("/login", {
    schema: {
      tags: ["auth"],
      summary: "Authenticate user",
      body: AuthSchemas.Login,
    }
  }, AuthController.Login);

  app.get("/refresh", {
    schema: {
      tags: ["auth"],
      summary: "Get new access token"
    }
  }, AuthController.Refresh);
};
