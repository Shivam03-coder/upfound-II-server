import { db } from "@src/core/database";
import { CompanyProfileData, RecruiterData } from "./recruiter.dto";
import { upsertWorkExperiences } from "@src/common/utils/work-experiences.utils";

class RecruiterService {
  static async createProfile(dto: RecruiterData) {
    try {
      await db.checkUserExist(dto.userId!);

      const recruiter = await db.$transaction(async (tx) => {
        const profile = await tx.profile.upsert({
          where: { id: dto.userId! },
          update: {
            phoneNumber: dto.phoneNumber,
            name: dto.name,
            tagline: dto.tagline,
            profilePicture: dto.profilePicture ?? undefined,
          },
          create: {
            id: dto.userId,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            name: dto.name,
            tagline: dto.tagline,
            profilePicture: dto.profilePicture ?? undefined,
          },
        });

        const recruiter = await tx.recruiter.upsert({
          where: { id: dto.userId! },
          create: {
            user: { connect: { id: dto.userId! } },
            aboutCompany: dto.aboutCompany,
            companyName: dto.companyName,
            designation: dto.designation,
            location: dto.location,
          },
          update: {
            aboutCompany: dto.aboutCompany,
            companyName: dto.companyName,
            designation: dto.designation,
            location: dto.location,
          },
        });

        await upsertWorkExperiences(
          tx as any,
          dto.userId!,
          dto.workExperiences || []
        );

        return { ...recruiter, ...profile };
      });
      return {
        message: "Recruiter created succesfully",
        recruiter: { ...recruiter },
      };
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(userId: string) {
    try {
      await db.checkUserExist(userId);
      const recruiter = await db.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          experience: true,
        },
      });
      return {
        message: "Recruiter fetched successfully",
        recruiter,
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(dto: RecruiterData) {
    try {
      await db.checkUserExist(dto.userId!);

      const recruiter = await db.$transaction(async (tx) => {
        const profile = await tx.profile.update({
          where: { id: dto.userId! },
          data: {
            phoneNumber: dto.phoneNumber,
            name: dto.name,
            tagline: dto.tagline,
            profilePicture: dto.profilePicture ?? undefined,
          },
        });

        const recruiter = await tx.recruiter.update({
          where: { id: dto.userId! },
          data: {
            aboutCompany: dto.aboutCompany,
            companyName: dto.companyName,
            designation: dto.designation,
            location: dto.location,
          },
        });

        await upsertWorkExperiences(
          tx as any,
          dto.userId!,
          dto.workExperiences || []
        );

        return { ...recruiter, ...profile };
      });

      return {
        message: "Recruiter updated successfully",
        recruiter: { ...recruiter },
      };
    } catch (error) {
      throw error;
    }
  }

  static async createCompany(dto:CompanyProfileData){
  try {
    
  } catch (error) {
    
  }
  }
}

export default RecruiterService;
