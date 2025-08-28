import { Router } from "express";
import { AuthController } from "./auth.controller";
import { requireAuth } from "@src/core/middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/google", AuthController.oAuthLoginHandler);
authRouter.post("/refresh/token", AuthController.refreshTokenHandler);
authRouter.post("/tokens", AuthController.getTestTokens);
authRouter.post("/sign-out", requireAuth, AuthController.signOutHandler);
authRouter.get("/user/info", requireAuth, AuthController.userInfoHandler);
export default authRouter;
