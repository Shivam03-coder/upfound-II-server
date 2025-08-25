import { CommunityType, PostMediaType } from "@prisma/client";

export type CreatePostData = {
  content: string;
  communityName: CommunityType;
  mediaurl?: string;
  userId?: string;
  mediaType: PostMediaType;
};

export interface EditPostData {
  content: string;
  userId?: string;
  postId: number;
}

export interface CommentsData {
  message: string;
  userId?: string;
  postId?: number;
  mediaUrl?: string;
  mediaType?: PostMediaType;
}

export interface CommentsReplyData extends CommentsData {
  parentId: number;
}

export interface ToggleLikeData {
  userId?: string;
  entityId: number;
  entityType: "POST" | "COMMENT";
}

export type DeletePostData = { postId: number; userId: string };
