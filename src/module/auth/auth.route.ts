import { Router } from "express";
import { requireAuth } from "@src/middleware/auth.middleware";
import { AuthController } from "./auth.controller";

const authRouter = Router();

authRouter
  .post("/google", AuthController.oAuthLoginHandler)
  .post("/refresh/token", AuthController.refreshTokenHandler)
  .post("/sign-out", requireAuth, AuthController.signOutHandler)
  .get("/user/info", requireAuth, AuthController.userInfoHandler)
  .post("/tokens", AuthController.getTestTokens);
export default authRouter;
