import { Router } from "express";
import CommunityController from "./community.controller";
import uploader from "@src/core/middleware/upload.middleware";
import { requireAuth } from "@src/core/middleware/auth.middleware";

const communityRouter = Router();
communityRouter.post("/post", uploader, requireAuth, CommunityController.createPostHanlder);
communityRouter.delete("/post/:postId", requireAuth, CommunityController.deletePostHandler);
communityRouter.put("/post/:postId",  requireAuth, CommunityController.editPostHandler);
communityRouter.get("/post",  requireAuth, CommunityController.getAllPostHandler);

export default communityRouter;
