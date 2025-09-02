import { PrismaClient } from "@prisma/client";
import { NotFoundError, ValidationError } from "@src/common/utils/error.utils";

export const db = new PrismaClient().$extends({
  model: {
    post: {
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

    jobSeeker: {
      async getJobSeekerId(userId: string) {
        const jobSeeker = await db.jobSeeker.findUnique({
          where: {
            id: userId,
          },
        });

        if (!jobSeeker) {
          throw new ValidationError("No jobseeker found");
        }
        return {
          jobSeekerId: jobSeeker.id,
        };
      },

      async checkIfUserHaveResume(userId: string) {
        const { jobSeekerId } = await this.getJobSeekerId(userId);
        const doc = await db.jobSeekerDocument.findFirst({
          where: {
            jobSeekerId,
          },
        });

        return {
          resumeUrl: doc?.documentUrl,
          docType: doc?.documentType,
          uploadedAt: doc?.createdAt,
        };
      },
    },

    job: {
      async ensureJobExist(jobId: string) {
        const job = await db.job.findFirst({
          where: { id: jobId },
          select: { id: true },
        });

        if (!job) {
          throw new NotFoundError(`Job with ID ${jobId} not found `);
        }

        return job.id;
      },
    },
  },
  client: {
    async checkUserExist(userId: string): Promise<boolean> {
      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundError("User not found");
      return true;
    },

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

    async isAuthor(postId: number, userId: string) {
      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
      });

      return post?.userId === userId ? "Author" : "User";
    },

    async ensureRecruiterExist(userId: string) {
      const recruiter = await db.recruiter.findUnique({
        where: { id: userId },
        select: { id: true, companyProfile: { select: { id: true } } },
      });

      if (!recruiter) {
        throw new NotFoundError(`Recruiter with ID ${userId} not found`);
      }

      if (!recruiter.companyProfile) {
        throw new NotFoundError(
          `Company profile not found for recruiter ${userId}`
        );
      }

      return {
        recruiterId: recruiter.id,
        companyId: recruiter.companyProfile.id,
      };
    },
  },
});
