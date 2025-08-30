import { DatabaseError } from "@src/common/utils/error.utils";
import { CreateJobDTO } from "./job.dto";
import { db } from "@src/core/database";

class JobService {
  static async createJob(dto: CreateJobDTO) {
    try {
      const { companyId, recruiterId } = await db.ensureRecruiterExist(
        dto.userId!
      );
      const job = await db.job.create({
        data: {
          jobRole: dto.jobRole,
          jobDescription: dto.jobDescription,
          typeOfPosition: dto.typeOfPosition,
          workMode: dto.workMode,
          jobLocation: dto.jobLocation,
          city: dto.city,
          state: dto.state,
          pincode: dto.pincode,
          country: dto.country,
          workExperience: dto.workExperience,
          salaryFrom: dto.salaryFrom,
          salaryTo: dto.salaryTo,
          equityFrom: dto.equityFrom,
          equityTo: dto.equityTo,
          jobStatus: dto.jobStatus ?? "REVIEW",
          companyId,
          recruiterId,
          JobApplicationQuestions: dto.jobApplicationQuestions
            ? {
                create: {
                  questions: dto.jobApplicationQuestions,
                },
              }
            : undefined,
          skills: dto.requiredSkills
            ? {
                create: dto.requiredSkills.map((skill) => ({
                  skill: {
                    connectOrCreate: {
                      where: { name: skill },
                      create: { name: skill },
                    },
                  },
                })),
              }
            : undefined,
        },
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
          JobApplicationQuestions: true,
        },
      });

      return {
        message: "Job created successfully",
        job,
      };
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getJobApplicants() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getCandidateHandler() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static editJobHandler() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getJobByIdHanlder() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getJobsByCompanyIdHandler() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getPopularJobsHandler() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getNewJobsHandler() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getProfileBasedJobsHandler() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getAllStartups() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getStartupDetailsById() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getSimilarJobsHandler() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static applyJobHandler() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static getAllUniqueSkills() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static updateJobStatus() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static updateApplicantJobStatus() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static updateCandidateApplicantJobStatus() {
    try {
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }
}

export default JobService;
