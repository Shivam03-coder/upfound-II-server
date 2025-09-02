import { DatabaseError, ValidationError } from "@src/common/utils/error.utils";
import { CreateJobDTO, JobApplyDto } from "./job.dto";
import { db } from "@src/core/database";
import parseAnswers from "@src/common/utils/parse-answers.utils";
import { Job, Prisma } from "@prisma/client";
import { Request } from "express";

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

  static async applyJob(dto: JobApplyDto) {
    try {
      const jobId = await db.job.ensureJobExist(dto.jobId);
      const { jobSeekerId } = await db.jobSeeker.getJobSeekerId(dto.userId!);

      const existingApplication = await db.jobToApplicant.findFirst({
        where: {
          jobId,
          applicantId: jobSeekerId,
        },
      });

      if (existingApplication) {
        throw new ValidationError("You have already applied to this job.");
      }

      const jobToApplicant = await db.jobToApplicant.create({
        data: {
          jobId,
          applicantId: jobSeekerId,
          jobStatus: "REVIEW",
        },
      });

      const jobApplication = await db.jobApplications.create({
        data: {
          resume: dto.resumeUrl!,
          answers: dto.answerRaw as string[],
          jobToApplicantId: jobToApplicant.id,
        },
      });

      await db.job.update({
        where: { id: jobId },
        data: {
          applicants: {
            connect: { id: jobToApplicant.id },
          },
        },
      });

      return {
        message: "Job applied successfully",
        jobApplication,
      };
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static async getJobApplicantsData(applicantIds: string[]) {
    try {
      const applicants = await db.jobToApplicant.findMany({
        where: { id: { in: applicantIds } },
        include: {
          JobApplications: true,
          Job: {
            include: {
              company: true,
              recruiter: true,
            },
          },
        },
      });

      const jobSeekerIds = applicants.map((a) => a.applicantId);

      const jobSeekers = await db.jobSeeker.findMany({
        where: { id: { in: jobSeekerIds } },
        include: {
          user: {
            include: {
              profile: true,
              experience: {
                include: { workExperiences: true },
              },
            },
          },
          documents: true,
          technicalProfile: {
            include: { certifications: true },
          },
          preferences: true,
          education: {
            include: { education: true },
          },
          culturePreferences: true,
        },
      });

      const result = applicants.map((app) => {
        const seeker = jobSeekers.find((js) => js.id === app.applicantId);
        return {
          applicantId: app.applicantId,
          application: app.JobApplications,
          job: app.Job,
          jobStatus: app.jobStatus,
          seeker,
        };
      });

      return { message: "All job applicanst fetched", result };
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static async editJob({ dto, jobId }: { dto: CreateJobDTO; jobId: string }) {
    try {
      const job = await db.job.update({
        where: { id: jobId },
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
          skills: dto.requiredSkills
            ? {
                deleteMany: {},
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
          JobApplicationQuestions: dto.jobApplicationQuestions
            ? {
                delete: {},
                create: {
                  questions: dto.jobApplicationQuestions,
                },
              }
            : undefined,
        },
        include: {
          skills: { include: { skill: true } },
          JobApplicationQuestions: true,
        },
      });

      return {
        message: "Job updated successfully",
        job,
      };
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static async getJobById(jobId: string) {
    try {
      const job = await db.job.findUnique({
        where: { id: jobId },
        include: {
          company: true,
          recruiter: true,
          skills: true,
          JobApplicationQuestions: true,
        },
      });

      if (!job) {
        throw new ValidationError("Job not found.");
      }

      return job;
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static async getJobsByCompanyId(
    userId: string,
    role: string,
    date?: string,
    startDate?: string,
    endDate?: string
  ) {
    try {
      const sortOrder = date === "desc" ? "desc" : "asc";

      const where: any = { userId, role };

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        where.createdAt = { gte: start, lte: end };
      }

      const jobs = await db.job.findMany({
        where,
        orderBy: { createdAt: sortOrder },
      });

      const totalCount = await db.job.count({ where });
      const openCount = await db.job.count({
        where: { ...where, jobStatus: "REVIEW" },
      });

      return { totalCount, openCount, jobs };
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static async getPopularJobs(
    page: number,
    limit: number,
    filters: Prisma.JobWhereInput
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = filters || {};

      const [jobs, totalJobs] = await Promise.all([
        db.job.findMany({
          where,
          orderBy: [{ jobView: "desc" }, { createdAt: "desc" }],
          skip,
          take: limit,
          include: { company: true },
        }),
        db.job.count({ where }),
      ]);

      return {
        jobs,
        totalJobs,
        currentPage: page,
        totalPages: Math.ceil(totalJobs / limit),
        hasFilters: Object.keys(where).length > 0,
      };
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static async getNewJobs(
    page: number,
    limit: number,
    filters: Prisma.JobWhereInput
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = filters || {};

      const [jobs, totalJobs] = await Promise.all([
        db.job.findMany({
          where,
          orderBy: [{ createdAt: "desc" }],
          skip,
          take: limit,
          include: { company: true },
        }),
        db.job.count({ where }),
      ]);

      return {
        jobs,
        totalJobs,
        currentPage: page,
        totalPages: Math.ceil(totalJobs / limit),
        hasFilters: Object.keys(where).length > 0,
      };
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  static async getProfileBasedJobs(
    userId: string,
    page: number,
    limit: number,
    filters: Prisma.JobWhereInput
  ) {
    try {
      const skip = (page - 1) * limit;

      const userProfile = await db.jobSeekerTechnicalProfile.findUnique({
        where: { id: userId },
        select: { skills: true },
      });

      const userSkills = userProfile?.skills || [];

      let where: Prisma.JobWhereInput = { ...filters };

      if (userSkills.length > 0) {
        where = {
          ...where,
          skills: {
            some: {
              skill: {
                name: { in: userSkills },
              },
            },
          },
        };
      }

      const [jobs, totalJobs] = await Promise.all([
        db.job.findMany({
          where,
          orderBy: [{ createdAt: "desc" }],
          skip,
          take: limit,
          include: {
            company: true,
            skills: { include: { skill: true } },
          },
        }),
        db.job.count({ where }),
      ]);

      return {
        jobs,
        totalJobs,
        currentPage: page,
        totalPages: Math.ceil(totalJobs / limit),
        hasFilters: Object.keys(filters).length > 0,
        hasProfileMatching: userSkills.length > 0,
      };
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
