import {
  CommentsData,
  CommentsReplyData,
  CreatePostData,
  DeletePostData,
  EditPostData,
  ToggleLikeData,
} from "./community.dto";
import { CommunityType, Prisma } from "@prisma/client";
import { DatabaseError, ValidationError } from "@src/common/utils/error.utils";
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

        const media = await tx.media.create({
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
    const postId = await db.ensurePostExists(dto.postId);

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
      dto.userId!
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

  static async getAllPosts() {
    return await db.post.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        likeCount: true,
        updatedAt: true,
        community: true,
        media: {
          select: {
            mediaType: true,
            url: true,
          },
        },
        user: {
          select: {
            id: true,
            profile: {
              select: { name: true, profilePicture: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async createComment(dto: CommentsData) {
    const postId = await db.ensurePostExists(dto.postId!);
    const role = await db.isAuthor(dto.postId!, dto.userId!);

    const comment = await db.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: {
          message: dto.message,
          role,
          userId: dto.userId!,
          postId,
        },
      });

      if (dto.mediaUrl && dto.mediaType) {
        await tx.media.create({
          data: {
            mediaType: dto.mediaType,
            url: dto.mediaUrl ?? "",
            commentId: comment.id,
          },
        });
      }
      return { ...comment };
    });

    return {
      comment,
      message: "Comment added sucesfully",
    };
  }

  static async getAllComments(postId: number) {
    await db.ensurePostExists(postId);

    const comments = await db.comment.findMany({
      where: { postId, parentId: null },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: { name: true, profilePicture: true },
            },
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                profile: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      comments,
      message: "All comments fetched successfully",
    };
  }

  static async replyToComment(dto: CommentsReplyData) {
    const postId = await db.ensurePostExists(dto.postId!);
    const role = await db.isAuthor(dto.postId!, dto.userId!);
    const comment = await db.comment.create({
      data: {
        message: dto.message,
        role,
        userId: dto.userId!,
        postId,
        parentId: dto.parentId,
      },
    });
    return {
      comment,
      message: "Comments reply added sucesfully",
    };
  }

  static async toggleLikeDislike(dto: ToggleLikeData) {
    const { userId, entityId, entityType } = dto;

    return await db.$transaction(async (tx) => {
      const existingLike = await tx.entityLike.findUnique({
        where: {
          entityId_entityType_userId: { entityId, entityType, userId: userId! },
        },
      });

      let liked: boolean;

      if (existingLike) {
        await tx.entityLike.delete({ where: { id: existingLike.id } });
        await this.updateLikeCount(tx as any, entityId, entityType, -1);
        liked = false;
      } else {
        await tx.entityLike.create({
          data: { entityId, entityType, userId: userId! },
        });
        await this.updateLikeCount(tx as any, entityId, entityType, +1);
        liked = true;
      }

      return {
        message: liked
          ? `You liked the ${entityType.toLowerCase()}`
          : `You unliked the ${entityType.toLowerCase()}`,
        data: {
          liked,
          entityId,
          entityType,
        },
      };
    });
  }

  static async postView(dto: { userId: string; postId: number }) {
    try {
      await db.ensurePostExists(dto.postId);
      const postView = await db.postView.create({
        data: {
          postId: dto.postId,
          userId: dto.userId,
        },
      });

      if (!postView) throw new ValidationError("Post view creation failed");

      const postViewCount = await db.postView.count({
        where: {
          postId: dto.postId,
        },
      });

      return {
        count: postViewCount,
        message: "Api success full",
      };
    } catch (error: any) {
      throw new ValidationError(error.message);
    }
  }

  static async popularPost() {
    const posts = await db.post.findMany({
      include: {
        _count: {
          select: { views: true },
        },
        user: {
          select: {
            id: true,
            profile: {
              select: {
                name: true,
                profilePicture: true,
              },
            },
          },
        },
        media: {
          select: {
            mediaType: true,
            url: true,
          },
        },
      },
      orderBy: {
        views: {
          _count: "desc",
        },
      },
    });
  
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likeCount: post.likeCount,
      community: post.community,
      viewCount: post._count.views,
      media: post.media.map((m) => ({
        mediaType: m.mediaType,
        url: m.url,
      })),
      user: {
        id: post.user.id,
        name: post.user.profile?.name,
        profilePicture: post.user.profile?.profilePicture,
      },
    }));
  
    return formattedPosts;
  }
  

  private static async updateLikeCount(
    tx: Prisma.TransactionClient,
    entityId: number,
    entityType: "COMMENT" | "POST",
    delta: number
  ) {
    if (entityType === "COMMENT") {
      await tx.comment.update({
        where: { id: entityId },
        data: { likeCount: { increment: delta } },
      });
    } else {
      await tx.post.update({
        where: { id: entityId },
        data: { likeCount: { increment: delta } },
      });
    }
  }
}

export default CommunityService;
