import {
  ApiResponse,
  AsyncHandler,
  getAuth,
} from "@src/common/utils/api.utils";
import { Request, Response } from "express";
import { CreatePostData } from "./community.dto";
import { s3Service } from "@src/common/libs/s3";
import CommunityService from "./community.service";

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
      const { userId } = await getAuth(req);

      const response = await CommunityService.getAllPosts({ userId });

      res.json(new ApiResponse("All posts fetched succesfully", response));
    }
  );
}

export default CommunityController;
