import { s3Service } from "@src/common/libs/s3";
import { CreatePostData, DeletePostData, EditPostData } from "./community.dto";
import { CommunityType } from "@prisma/client";
import {
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@src/common/utils/error.utils";
import { db } from "@src/core/database";

class CommunityService {
  static async createPost(dto: CreatePostData) {
    try {
      if (!Object.values(CommunityType).includes(dto.communityName))
        throw new ValidationError("Community name is not found");

      const createdPost = await db.$transaction(async (tx) => {
        const post = await tx.post.create({
          data: {
            userId: dto.userId as string,
            community: dto.communityName,
            content: dto.content,
          },
        });

        const media = await tx.postMedia.create({
          data: {
            mediaType: dto.mediaType,
            url: dto.mediaurl ?? "",
            postId: post.id,
          },
        });

        return {
          postId: post.id,
          mediaUrl: media.url,
        };
      });

      return {
        createdPost,
      };
    } catch (error: any) {
      console.log(error);

      if (error instanceof ValidationError) {
        throw error;
      }

      if (error?.code === "P2002" || error?.message?.includes("community")) {
        throw new ValidationError(
          "Community name is not valid or does not exist"
        );
      }

      throw new DatabaseError("Unable to save post to db");
    }
  }
  static async deletePost(dto: DeletePostData) {
    const postId = await db.post.ensurePostExists(dto.postId);

    await db.post.delete({
      where: {
        id: postId,
      },
    });
    return {
      message: "Post delted succesfully",
    };
  }
  static async editPost(dto: EditPostData) {
    const postId = await db.post.ensurePostExistsForUser(
      dto.postId,
      dto.userId
    );

    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        content: dto.content,
      },
    });
    return {
      message: "Post edited succesfully",
    };
  }
  static async getAllPosts(dto: { userId: string }) {
    return await db.post.findMany({
      where: {
        userId: dto.userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        likeCount: true,
        commentCount: true,
        updatedAt: true,
        community: true,
        media: {
          select: {
            mediaType: true,
            url: true,
          },
        },
      },
    });
  }
}

export default CommunityService;
