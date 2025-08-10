import { CommunityType, PostMediaType } from "@prisma/client";

export type CreatePostData = {
  content: string;
  communityName: CommunityType;
  mediaurl?: string;
  userId?: string;
  mediaType: PostMediaType;
};

export type EditPostData = {
  content: string;
  userId: string;
  postId: number;
};
export type DeletePostData = { postId: number; userId: string };
