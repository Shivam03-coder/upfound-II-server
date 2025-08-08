import { Router } from "express";
import { AuthController } from "./auth.controller";
import { requireAuth } from "@src/core/middleware/auth.middleware";

const authRouter = Router();

authRouter
  .post("/google", AuthController.oAuthLoginHandler)
  .post("/refresh/token", AuthController.refreshTokenHandler)
  .post("/sign-out", requireAuth, AuthController.signOutHandler)
  .get("/user/info", requireAuth, AuthController.userInfoHandler)
  .post("/tokens", AuthController.getTestTokens);
export default authRouter;
