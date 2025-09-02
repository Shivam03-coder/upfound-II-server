import { JobStatus, UserRole } from "@prisma/client";

export interface CreateJobDTO {
  jobRole: string;
  jobDescription: string;
  typeOfPosition: string;
  workMode: string;
  jobLocation: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  workExperience?: string;
  salaryFrom?: number;
  salaryTo?: number;
  equityFrom?: number;
  equityTo?: number;
  jobStatus?: JobStatus;
  userId?: string;
  jobApplicationQuestions?: string[];
  requiredSkills?: string[];
}

export interface JobApplyDto {
  answerRaw: unknown;
  resumeUrl?: string;
  jobId: string;
  userId?: string;
}
