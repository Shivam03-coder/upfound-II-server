import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "@src/common/utils/error.utils";

export const db = new PrismaClient().$extends({
  model: {
    post: {
      async ensurePostExists(postId: number) {
        const post = await db.post.findUnique({
          where: { id: postId },
          select: { id: true },
        });

        if (!post) {
          throw new NotFoundError(`Post with ID ${postId} not found`);
        }

        return post.id;
      },

      async ensurePostExistsForUser(postId: number, userId: string) {
        const post = await db.post.findFirst({
          where: { id: postId, userId },
          select: { id: true },
        });

        if (!post) {
          throw new NotFoundError(
            `Post with ID ${postId} not found for user ${userId}`
          );
        }

        return post.id;
      },
    },
  },
});
