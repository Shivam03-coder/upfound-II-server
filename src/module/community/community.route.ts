import { Router } from "express";
import CommunityController from "./community.controller";
import uploader from "@src/core/middleware/upload.middleware";

const communityRouter = Router();

communityRouter.post(
  "/upload",
  uploader,
  CommunityController.uploadPostHandler
);
export default communityRouter;
