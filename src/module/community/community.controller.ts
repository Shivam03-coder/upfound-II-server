import {
  ApiResponse,
  AsyncHandler,
  getAuth,
} from "@src/common/utils/api.utils";
import { Request, Response } from "express";
import { CreatePostData } from "./community.dto";
import { s3Service } from "@src/common/libs/s3";

class CommunityController {
  static createPost = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const data = req.body as CreatePostData;

      // TODO: Implement actual post creation logic
      res.json(new ApiResponse("Post created successfully", { userId, data }));
    }
  );

  static uploadPostHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { url, key } = await s3Service.uploadFile(req);

      res.json(
        new ApiResponse("File uploaded successfully", {
          key,
          url,
        })
      );
    }
  );
}

export default CommunityController;
