import {
  ActivelyLookingStatus,
  JobSeekerStatus,
  JobType,
  PrimaryInterest,
  StartupStagePreference,
  WorkArrangement,
} from "@prisma/client";

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

export interface PreferencesData {
  userId?: string;
  activelyLooking: ActivelyLookingStatus;
  jobType: JobType;
  startupStagePreference: StartupStagePreference;
  workArrangement: WorkArrangement;
}

export interface UploadResumeData {
  userId?: string;
  resumeUrl?: string;
}

export interface JobPreferences {
  nextJobGoals: string;
  workMotivation: string;
  workStylePreference: string;
  preferredWorkEnvironment: string;
  userId?: string;
}

export interface ProjectLinkData {
  userId?: string;
  links: string[];
}

export interface UpdateProfilePicData {
  userId?: string;
  profilePicture?: string;
}
