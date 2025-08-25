import { WorkExperience } from "../job-seeker/jobseeker.dto";

export interface RecruiterData {
  name: string;
  phoneNumber: string;
  email: string;
  gender: string;
  companyName: string;
  designation: string;
  location: string;
  aboutCompany: string;
  tagline: string;
  workExperiences: WorkExperience[];
  userId?: string;
  profilePicture?: string;
}

export interface CompanyProfileData {
  id: string;
  role: string;
  companyName: string;
  companyType?: string;
  companyPic?: string;
  websiteLink?: string;
  location?: string;
  companyStage?: string;
  companySize?: string;
  foundedIn?: number;
  foundedYear?: string;
  workEmail?: string;
  companySummary?: string;
  fundingDetails?: string;
  recruiterId?: string;
  socialLinks: string[];
}
