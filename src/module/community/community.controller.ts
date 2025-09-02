import {
  ApiResponse,
  AsyncHandler,
  getAuth,
} from "@src/common/utils/api.utils";
import { Request, Response } from "express";
import {
  CommentsData,
  CommentsReplyData,
  CreatePostData,
} from "./community.dto";
import { s3Service } from "@src/common/libs/s3";
import CommunityService from "./community.service";
import { CommunityType } from "@prisma/client";

class CommunityController {
  static createPostHanlder = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const data = req.body as CreatePostData;
      let mediaurl;
      if (data.mediaType) {
        const res = (await s3Service.uploadFile(req)) ?? "";
        mediaurl = res.url;
      }

      const response = await CommunityService.createPost({
        ...data,
        mediaurl,
        userId,
      });

      res.json(new ApiResponse("Post created successfully", { response }));
    }
  );

  static deletePostHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const postId = parseInt(req.params.postId);
      const response = await CommunityService.deletePost({ postId, userId });
      res.json(new ApiResponse(response.message));
    }
  );

  static editPostHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const postId = parseInt(req.params.postId);
      const { content } = req.body;

      const response = await CommunityService.editPost({
        postId,
        userId,
        content,
      });

      res.json(new ApiResponse(response.message));
    }
  );

  static getAllPostHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const response = await CommunityService.getAllPosts();
      res.json(new ApiResponse("All posts fetched succesfully", response));
    }
  );

  static getUserPostHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const response = await CommunityService.getUserPosts({ userId });
      res.json(new ApiResponse("All posts fetched for user succesfully", response));
    }
  );
  static getPostByCommunityHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const response = await CommunityService.getPostByCommunity({ communityName: req.params.communityName as CommunityType });
      res.json(new ApiResponse("All posts fetched for community succesfully", response));
    }
  );

  static createCommentHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const data = req.body as CommentsData;
      const postId = parseInt(req.params.postId as string, 10);

      let mediaUrl;
      if (data.mediaType) {
        const res = (await s3Service.uploadFile(req)) ?? "";
        mediaUrl = res.url;
      }
      const resp = await CommunityService.createComment({
        ...data,
        postId,
        userId,
        mediaUrl,
      });

      res.status(200).json(new ApiResponse(resp.message, resp.comment));
    }
  );

  static replyToCommentHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const { message, mediaType }: CommentsReplyData = req.body;
      const postId = Number(req.params.postId);
      const parentId = Number(req.params.parentId);

      if (isNaN(postId) || isNaN(parentId)) {
        res
          .status(400)
          .json(new ApiResponse("Invalid postId or parentId", null));
        return;
      }

      let mediaUrl: string | undefined;
      if (mediaType) {
        const upload = await s3Service.uploadFile(req);
        mediaUrl = upload?.url ?? undefined;
      }

      const resp = await CommunityService.replyToComment({
        message,
        mediaType,
        postId,
        parentId,
        userId,
        mediaUrl,
      });

      res.status(200).json(new ApiResponse(resp.message, resp.comment));
    }
  );

  static getAllCommentsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const postId = Number(req.params.postId);
      const resp = await CommunityService.getAllComments(postId);
      res.status(200).json(new ApiResponse(resp.message, resp.comments));
    }
  );

  static toggleLikeDislikeHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const { entityId, entityType } = req.params;
      const entityIdNum = Number(entityId);
      if (isNaN(entityIdNum)) {
        res.status(400).json(new ApiResponse("Invalid entityId", null));
        return;
      }
      const validEntityTypes = ["POST", "COMMENT"];
      if (!validEntityTypes.includes(entityType)) {
        res.status(400).json(new ApiResponse("Invalid entityType", null));
        return;
      }

      const resp = await CommunityService.toggleLikeDislike({
        entityId: entityIdNum,
        entityType: entityType as "POST" | "COMMENT",
        userId,
      });
      res.status(200).json(new ApiResponse(resp.message, resp.data));
    }
  );

  static postViewHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const postId = parseInt(req.params.postId);
      const { userId } = await getAuth(req);
      const resp = await CommunityService.postView({ userId, postId });
      res.status(200).json(new ApiResponse(resp.message, resp.count));
    }
  );

  static getPopularPostsHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const resp = await CommunityService.popularPost();
      res
        .status(200)
        .json(new ApiResponse("Popular post fetched succesfully", resp));
    }
  );
}

export default CommunityController;
