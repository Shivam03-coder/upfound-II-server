import { Router } from "express";
import RecruiterController from "./recruiter.controller";
import { requireAuth } from "@src/core/middleware/auth.middleware";
import uploader from "@src/core/middleware/upload.middleware";
const recruiterRouter = Router();
recruiterRouter.use(requireAuth)

recruiterRouter.post("/profile",uploader,RecruiterController.createProfileHandler);
recruiterRouter.get("/profile", RecruiterController.getProfileHandler);
recruiterRouter.put("/profile",uploader,RecruiterController.createProfileHandler);

export default recruiterRouter;
