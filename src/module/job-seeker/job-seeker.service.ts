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
import { upsertWorkExperiences } from "@src/common/utils/work-experiences.utils";
export class JobSeekerService {
  static async saveUserProfileInfo(dto: CreateprofileInformationData) {
    try {
      const isFreshUser = dto.status === JobSeekerStatus.FRESHER;

      const jobSeeker = await db.$transaction(async (tx) => {
        await tx.profile.upsert({
          where: { id: dto.userId },
          update: {
            phoneNumber: dto.phoneNumber,
            name: dto.name,
            age: dto.age,
            tagline: dto.tagline,
            profilePicture: dto.profilePicture ?? undefined,
          },
          create: {
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            name: dto.name,
            age: dto.age,
            tagline: dto.tagline,
            profilePicture: dto.profilePicture ?? undefined,
          },
        });

        const jobSeeker = await tx.jobSeeker.upsert({
          where: { id: dto.userId },
          update: {
            location: dto.location,
            status: dto.status,
            primaryInterest: dto.primaryInterest,
          },
          create: {
            id: dto.userId!,
            location: dto.location,
            status: dto.status,
            primaryInterest: dto.primaryInterest,
          },
        });

        if (!isFreshUser) {
          await upsertWorkExperiences(
            tx as any,
            dto.userId!,
            dto.workExperiences || []
          );
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

    try {
      const result = await db.$transaction(async (tx) => {
        await tx.profile.update({
          where: { id: dto.userId! },
          data: {
            tagline: dto.tagline,
            gender: dto.gender,
            bio: dto.bio,
            age: dto.age,
            profilePicture: dto.profilePicture,
          },
        });

        const jobseeker = await tx.jobSeeker.upsert({
          where: { id: dto.userId },
          update: {
            location: dto.location,
            primaryInterest: dto.primaryInterest,
            status: dto.status,
          },
          create: {
            id: dto.userId!,
            location: dto.location,
            primaryInterest: dto.primaryInterest,
            status: dto.status,
          },
        });

        await tx.jobSeekerEducation.upsert({
          where: { jobSeekerId: jobseeker.id },
          update: {
            education: { deleteMany: {}, create: dto.education || [] },
          },
          create: {
            jobSeekerId: jobseeker.id,
            education: { create: dto.education || [] },
          },
        });

        await tx.jobSeekerTechnicalProfile.upsert({
          where: { jobSeekerId: jobseeker.id },
          update: {
            desiredRoles: dto.desiredRoles,
            skills: dto.skills,
            certifications: {
              deleteMany: {},
              create: dto.certifications || [],
            },
          },
          create: {
            jobSeekerId: jobseeker.id,
            desiredRoles: dto.desiredRoles,
            skills: dto.skills,
            certifications: { create: dto.certifications || [] },
          },
        });

        if (!isFreshUser) {
          await upsertWorkExperiences(
            tx as any,
            dto.userId!,
            dto.workExperiences || []
          );
        }

        return { message: "User profile overview saved succesfully" };
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
      const userProjectLink = await db.profile.update({
        where: {
          id: dto.userId,
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
      where: { id: dto.userId },
      include: {
        projectLinks: true,
        technicalProfile: {
          include: {
            certifications: true,
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
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    const experience = await db.user.findUnique({
      where: {
        id: dto.userId,
      },
      include: {
        experience: {
          include: {
            workExperiences: true,
          },
        },
      },
    });

    if (!jobSeeker) return null;

    return {
      profile: {
        title: "Profile",
        data: jobSeeker.user.profile || {},
      },
      preferences: {
        title: "Preferences",
        data: jobSeeker.preferences || {},
      },
      culturePreferences: {
        title: "Culture Preferences",
        data: jobSeeker.culturePreferences || {},
      },
      projectLinks: {
        title: "Project Links",
        data: jobSeeker.projectLinks || {},
      },
      technicalProfile: {
        title: "Technical Profile",
        data: {
          ...jobSeeker.technicalProfile,
          certifications: jobSeeker.technicalProfile?.certifications || [],
        },
      },
      education: {
        title: "Education",
        data: jobSeeker.education?.education || [],
      },
      workExperiences: {
        title: "Work Experiences",
        data: experience?.experience?.workExperiences || [],
      },
      documents: {
        title: "Documents",
        data: jobSeeker.documents || [],
      },
    };
  }
}
