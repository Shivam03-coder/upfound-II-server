import { Router } from "express";
import CommunityController from "./community.controller";
import uploader from "@src/core/middleware/upload.middleware";
import { requireAuth } from "@src/core/middleware/auth.middleware";

const communityRouter = Router();
communityRouter.use(requireAuth)
communityRouter.post("/post", uploader, CommunityController.createPostHanlder);
communityRouter.delete("/post/:postId", CommunityController.deletePostHandler);
communityRouter.put("/post/:postId", CommunityController.editPostHandler);
communityRouter.get("/post", CommunityController.getAllPostHandler);
communityRouter.post("/comment/:postId",uploader,CommunityController.createCommentHandler);
communityRouter.post("/reply/:postId/comment/:parentId",uploader,CommunityController.replyToCommentHandler);
communityRouter.get("/comment/:postId",CommunityController.getAllCommentsHandler);
communityRouter.patch("/like/:entityId/type/:entityType",CommunityController.toggleLikeDislikeHandler);
communityRouter.patch("/post/:postId/view",CommunityController.postViewHandler); // POST VIEW
communityRouter.get("/post/popular",CommunityController.getPopularPostsHandler); // POPULAR POST

export default communityRouter;


