import { JobSeekerStatus, PrimaryInterest } from "@prisma/client";

export interface CreateprofileInformationData {
  name: string;
  age?: number;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  primaryInterest?: PrimaryInterest | undefined;
  location: string;
  tagline: string;
  isPhoneNumberVerified?: boolean;
  status?: JobSeekerStatus | undefined;
  workExperiences?: WorkExperience[] | null;
  userId?: string;
}

export interface WorkExperience {
  title: string;
  employmentType: string;
  company: string;
  startMonth?: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
}

export interface CreateprofileOverviewData {
  firstName?: string;
  lastName?: string;
  age?: number;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  bio?: string;
  tagline?: string;
  location?: string;
  profilePicture?: string;
  primaryInterest?: PrimaryInterest;
  status?: JobSeekerStatus;
  education?: Array<{
    degree: string;
    institution: string;
    graduationYear?: number;
  }>;
  desiredRoles?: string[];
  skills?: string[];
  certifications?: Array<{
    name: string;
    institution: string;
    graduationYear: number;
  }>;
  workExperiences?: WorkExperience[];
  userId?: string;
}
