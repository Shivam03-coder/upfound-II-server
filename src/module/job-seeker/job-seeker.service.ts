import { db } from "@src/core/database";
import {
  CreateprofileInformationData,
  CreateprofileOverviewData,
  JobPreferences,
  PreferencesData,
  ProjectLinkData,
  UpdateProfilePicData,
  UploadResumeData,
} from "./jobseeker.dto";
import { JobSeekerStatus, Prisma } from "@prisma/client";
import transformWorkExperiences from "@src/common/utils/transform-months.utils";

export class JobSeekerService {
  static async saveUserProfileInfo(dto: CreateprofileInformationData) {
    try {
      const isFreshUser = dto.status === JobSeekerStatus.FRESHER;
      let workExperiences: Prisma.JobSeekerExperienceCreateWithoutWorkExperienceGroupInput[] =
        [];

      if (!isFreshUser && dto.workExperiences) {
        workExperiences = transformWorkExperiences(dto.workExperiences);
      }

      const existingUser = await db.user.findUnique({
        where: { id: dto.userId },
        select: { name: true, phoneNumber: true },
      });

      const updateData = {
        ...(!existingUser?.name?.trim() ? { name: dto.name } : {}),
        ...(!existingUser?.phoneNumber?.trim()
          ? { phoneNumber: dto.phoneNumber }
          : {}),
      };

      const jobSeeker = await db.$transaction(async (tx) => {
        if (Object.keys(updateData).length > 0) {
          await tx.user.update({
            where: { id: dto.userId },
            data: updateData,
          });
        }

        const jobSeeker = await tx.jobSeeker.upsert({
          where: { userId: dto.userId },
          update: {
            age: dto.age,
            location: dto.location,
            tagline: dto.tagline,
            status: dto.status,
            primaryInterest: dto.primaryInterest,
            profilePicture: dto.profilePicture ?? undefined,
          },
          create: {
            userId: dto.userId!,
            age: dto.age,
            location: dto.location,
            tagline: dto.tagline,
            status: dto.status,
            primaryInterest: dto.primaryInterest,
            profilePicture: dto.profilePicture ?? undefined,
          },
        });

        await tx.jobSeekerWorkExperience.deleteMany({
          where: { jobSeekerId: jobSeeker.id },
        });

        if (!isFreshUser && workExperiences.length > 0) {
          await tx.jobSeekerWorkExperience.create({
            data: {
              jobSeekerId: jobSeeker.id,
              workExperiences: { create: workExperiences },
            },
          });
        }
        return jobSeeker;
      });

      return { message: "User profile saved succesfully", user: jobSeeker };
    } catch (error) {
      console.error("Error saving user profile:", error);
      throw error;
    }
  }

  static async saveUserProfileOverview(dto: CreateprofileOverviewData) {
    const isFreshUser = dto.status === JobSeekerStatus.FRESHER;
    let workExperiences: Prisma.JobSeekerExperienceCreateWithoutWorkExperienceGroupInput[] =
      [];
    if (!isFreshUser && dto.workExperiences) {
      workExperiences = transformWorkExperiences(dto.workExperiences);
    }

    try {
      const result = await db.$transaction(async (tx) => {
        const jobSeeker = await tx.jobSeeker.upsert({
          where: { userId: dto.userId },
          update: {
            age: dto.age,
            bio: dto.bio,
            gender: dto.gender,
            location: dto.location,
            tagline: dto.tagline,
            profilePicture: dto.profilePicture,
            primaryInterest: dto.primaryInterest,
            status: dto.status,
          },
          create: {
            userId: dto.userId!,
            age: dto.age,
            bio: dto.bio,
            gender: dto.gender,
            location: dto.location,
            tagline: dto.tagline,
            profilePicture: dto.profilePicture,
            primaryInterest: dto.primaryInterest,
            status: dto.status,
          },
          select: {
            id: true,
            workExperience: {
              select: {
                id: true,
              },
            },
          },
        });

        await tx.jobSeekerEducation.upsert({
          where: { jobSeekerId: jobSeeker.id },
          update: {
            education: {
              deleteMany: {},
              create: dto.education || [],
            },
          },
          create: {
            jobSeekerId: jobSeeker.id,
            education: {
              create: dto.education || [],
            },
          },
        });

        await tx.jobSeekerTechnicalProfile.upsert({
          where: { jobSeekerId: jobSeeker.id },
          update: {
            desiredRoles: dto.desiredRoles,
            skills: dto.skills,
            certifications: {
              deleteMany: {},
              create: dto.certifications || [],
            },
          },
          create: {
            jobSeekerId: jobSeeker.id,
            desiredRoles: dto.desiredRoles,
            skills: dto.skills,
            certifications: {
              create: dto.certifications || [],
            },
          },
        });

        await tx.jobSeekerExperience.deleteMany({
          where: { groupId: jobSeeker.workExperience?.id },
        });

        await tx.jobSeekerWorkExperience.delete({
          where: {
            jobSeekerId: jobSeeker.id,
          },
        });

        if (!isFreshUser && workExperiences.length > 0) {
          await tx.jobSeekerWorkExperience.create({
            data: {
              jobSeekerId: jobSeeker.id,
              workExperiences: {
                create: workExperiences,
              },
            },
          });
        }

        return {
          message: "User profile overview saved succesfully",
        };
      });

      return result;
    } catch (error) {
      console.error("Error saving user profile overview:", error);
      throw error;
    }
  }

  static async savePreferences(dto: PreferencesData) {
    try {
      const { jobSeekerId } = await db.jobSeeker.getJobSeekerId(dto.userId!);
      const userPreference = await db.jobSeekerPreferences.upsert({
        where: { jobSeekerId },
        update: {
          activelyLooking: dto.activelyLooking,
          jobType: dto.jobType,
          startupStagePreference: dto.startupStagePreference,
          workArrangement: dto.workArrangement,
        },
        create: {
          jobSeekerId,
          activelyLooking: dto.activelyLooking,
          jobType: dto.jobType,
          startupStagePreference: dto.startupStagePreference,
          workArrangement: dto.workArrangement,
        },
      });
      return {
        message: "User profile preferences saved",
        preference: userPreference,
      };
    } catch (error: any) {
      console.warn(error);
      throw new Error(error.message);
    }
  }

  static async saveResume(dto: UploadResumeData) {
    try {
      const { jobSeekerId } = await db.jobSeeker.getJobSeekerId(dto.userId!);
      const userDocs = await db.jobSeekerDocument.create({
        data: {
          documentUrl: dto.resumeUrl!,
          jobSeekerId,
          fileType: "PDF",
          documentType: "RESUME",
        },
      });
      return {
        message: "User resume uplaoded succesfully",
        docs: userDocs,
      };
    } catch (error: any) {
      console.warn(error);
      throw new Error(error.message);
    }
  }

  static async saveJobCulture(dto: JobPreferences) {
    try {
      const { jobSeekerId } = await db.jobSeeker.getJobSeekerId(dto.userId!);
      const userJobCulture = await db.jobSeekerCulturePreferences.create({
        data: {
          jobSeekerId,
          nextJobGoals: dto.nextJobGoals,
          preferredWorkEnvironment: dto.preferredWorkEnvironment,
          workMotivation: dto.workMotivation,
          workStylePreference: dto.workStylePreference,
        },
      });
      return {
        message: "User culture saved succesfully",
        culture: userJobCulture,
      };
    } catch (error: any) {
      console.warn(error);
      throw new Error(error.message);
    }
  }

  static async saveProjectLinks(dto: ProjectLinkData) {
    try {
      const { jobSeekerId } = await db.jobSeeker.getJobSeekerId(dto.userId!);
      const userProjectLink = await db.jobSeekerProjectLink.create({
        data: {
          jobSeekerId,
          projectLink: dto.links,
        },
      });
      return {
        message: "User proeject links saved succesfully",
        culture: userProjectLink,
      };
    } catch (error: any) {
      console.warn(error);
      throw new Error(error.message);
    }
  }

  static async updateProfilePicture(dto: UpdateProfilePicData) {
    try {
      const { jobSeekerId } = await db.jobSeeker.getJobSeekerId(dto.userId!);
      const userProjectLink = await db.jobSeeker.update({
        where: {
          id: jobSeekerId,
        },
        data: {
          profilePicture: dto.profilePicture,
        },
      });
      return {
        message: "User proeject links saved succesfully",
        jobseeker: userProjectLink,
      };
    } catch (error: any) {
      console.warn(error);
      throw new Error(error.message);
    }
  }

  static async getJobSeekerProfile(dto: { userId: string }) {
    const jobSeeker = await db.jobSeeker.findUnique({
      where: { userId: dto.userId },
      include: {
        projectLinks: true,
        technicalProfile: {
          include: {
            certifications: true,
          },
        },
        workExperience: {
          include: {
            workExperiences: true,
          },
        },
        preferences: true,
        education: {
          include: {
            education: true,
          },
        },
        documents: true,
        culturePreferences: true,
        user: true,
      },
    });

    if (!jobSeeker) return null;

    return {
      ...jobSeeker.user,
      ...jobSeeker.preferences,
      ...jobSeeker.culturePreferences,
      ...jobSeeker.projectLinks,
      ...jobSeeker.technicalProfile,
      certifications: jobSeeker.technicalProfile?.certifications || [],
      education: jobSeeker.education?.education || [],
      workExperiences: jobSeeker.workExperience?.workExperiences || [],
      documents: jobSeeker.documents || [],
    };
  }
}
