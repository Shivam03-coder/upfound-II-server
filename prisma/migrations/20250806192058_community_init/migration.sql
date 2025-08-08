-- CreateEnum
CREATE TYPE "PrimaryInterest" AS ENUM ('TECH_DEVELOPER_ENGINEER', 'PRODUCT_MANAGEMENT', 'UI_UX_DESIGN', 'MARKETING_GROWTH', 'SALES_BD', 'HR_TALENT', 'OPERATIONS', 'FINANCE', 'LEGAL_COMPLIANCE', 'CONTENT_COPYWRITING', 'GENERALIST');

-- CreateEnum
CREATE TYPE "JobSeekerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "ActivelyLookingStatus" AS ENUM ('ACTIVELY_LOOKING', 'OPEN_TO_WORK', 'NOT_LOOKING_NOW');

-- CreateEnum
CREATE TYPE "WorkArrangement" AS ENUM ('REMOTE', 'HYBRID', 'ON_SITE');

-- CreateEnum
CREATE TYPE "StartupStagePreference" AS ENUM ('EARLY_STAGE', 'GROWTH_STAGE', 'MATURE_STAGE');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('INTERNSHIPS', 'FULL_TIME', 'FREELANCE', 'PART_TIME', 'CO_FOUNDER', 'ADVISOR_MENTOR');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RESUME', 'COVER_LETTER', 'PORTFOLIO');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('JOBSEEKER', 'RECRUITER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CommunityType" AS ENUM ('FINTECH', 'HEALTHTECH', 'AGRITECH', 'D2C_ECOMMERCE', 'EDTECH', 'AI_ML_DEEPTECH', 'HR_TECH', 'CREATOR_ECONOMY', 'CLIMATE_TECH', 'SAAS', 'WEB3_BLOCKCHAIN', 'OTHER_DOMAINS', 'BANGALORE_STARTUPS', 'PUNE_STARTUPS', 'DELHI_NCR_STARTUPS', 'TIER2_CITY_STARTUPS', 'REMOTE_GLOBAL_STARTUPS', 'ASKUP', 'IDEA2GO', 'STARTFIRST', 'PROOFZONE', 'BUILDCORE', 'SCALEMODE', 'PITCHPLAY');

-- CreateEnum
CREATE TYPE "PostMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('POST', 'COMMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeeker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "bio" TEXT,
    "profilePicture" TEXT,
    "primaryInterest" "PrimaryInterest",
    "location" TEXT,
    "tagline" TEXT,
    "isPhoneNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "JobSeekerStatus",
    "profileView" INTEGER NOT NULL DEFAULT 0,
    "searchView" INTEGER NOT NULL DEFAULT 0,
    "gender" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSeeker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerProjectLink" (
    "id" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "projectLink" TEXT[],

    CONSTRAINT "JobSeekerProjectLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerTechnicalProfile" (
    "id" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "desiredRoles" TEXT[],
    "skills" TEXT[],
    "yearsOfExperience" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSeekerTechnicalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerCertification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "technicalProfileId" TEXT NOT NULL,

    CONSTRAINT "JobSeekerCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerWorkExperience" (
    "id" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSeekerWorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerExperience" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "startMonth" INTEGER,
    "startYear" INTEGER,
    "endMonth" INTEGER,
    "endYear" INTEGER,

    CONSTRAINT "JobSeekerExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerPreferences" (
    "id" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "activelyLooking" "ActivelyLookingStatus" NOT NULL,
    "workArrangement" "WorkArrangement" NOT NULL,
    "startupStagePreference" "StartupStagePreference" NOT NULL,
    "jobType" "JobType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSeekerPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerEducation" (
    "id" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSeekerEducation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerEducationItem" (
    "id" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "graduationYear" INTEGER,
    "educationId" TEXT NOT NULL,

    CONSTRAINT "JobSeekerEducationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerDocument" (
    "id" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL DEFAULT 'RESUME',
    "fileType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSeekerDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeekerCulturePreferences" (
    "id" TEXT NOT NULL,
    "jobSeekerId" TEXT NOT NULL,
    "nextJobGoals" TEXT,
    "workMotivation" TEXT,
    "workStylePreference" TEXT,
    "preferredWorkEnvironment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobSeekerCulturePreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "content" VARCHAR(5000) NOT NULL,
    "community" "CommunityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts_media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mediaType" "PostMediaType" NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "posts_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "postId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_likes" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "entity_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeeker_userId_key" ON "JobSeeker"("userId");

-- CreateIndex
CREATE INDEX "JobSeeker_isPhoneNumberVerified_idx" ON "JobSeeker"("isPhoneNumberVerified");

-- CreateIndex
CREATE INDEX "JobSeeker_status_idx" ON "JobSeeker"("status");

-- CreateIndex
CREATE INDEX "JobSeeker_profileView_idx" ON "JobSeeker"("profileView");

-- CreateIndex
CREATE INDEX "JobSeeker_searchView_idx" ON "JobSeeker"("searchView");

-- CreateIndex
CREATE INDEX "JobSeeker_location_idx" ON "JobSeeker"("location");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeekerProjectLink_jobSeekerId_key" ON "JobSeekerProjectLink"("jobSeekerId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeekerTechnicalProfile_jobSeekerId_key" ON "JobSeekerTechnicalProfile"("jobSeekerId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeekerWorkExperience_jobSeekerId_key" ON "JobSeekerWorkExperience"("jobSeekerId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeekerPreferences_jobSeekerId_key" ON "JobSeekerPreferences"("jobSeekerId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeekerEducation_jobSeekerId_key" ON "JobSeekerEducation"("jobSeekerId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeekerCulturePreferences_jobSeekerId_key" ON "JobSeekerCulturePreferences"("jobSeekerId");

-- CreateIndex
CREATE INDEX "posts_userId_idx" ON "posts"("userId");

-- CreateIndex
CREATE INDEX "posts_community_idx" ON "posts"("community");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");

-- CreateIndex
CREATE INDEX "posts_media_postId_idx" ON "posts_media"("postId");

-- CreateIndex
CREATE INDEX "post_comments_postId_idx" ON "post_comments"("postId");

-- CreateIndex
CREATE INDEX "post_comments_userId_idx" ON "post_comments"("userId");

-- CreateIndex
CREATE INDEX "post_comments_createdAt_idx" ON "post_comments"("createdAt");

-- CreateIndex
CREATE INDEX "entity_likes_entityId_entityType_idx" ON "entity_likes"("entityId", "entityType");

-- CreateIndex
CREATE INDEX "entity_likes_userId_idx" ON "entity_likes"("userId");

-- CreateIndex
CREATE INDEX "entity_likes_likedAt_idx" ON "entity_likes"("likedAt");

-- CreateIndex
CREATE UNIQUE INDEX "entity_likes_entityId_entityType_userId_key" ON "entity_likes"("entityId", "entityType", "userId");

-- AddForeignKey
ALTER TABLE "JobSeeker" ADD CONSTRAINT "JobSeeker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerProjectLink" ADD CONSTRAINT "JobSeekerProjectLink_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerTechnicalProfile" ADD CONSTRAINT "JobSeekerTechnicalProfile_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerCertification" ADD CONSTRAINT "JobSeekerCertification_technicalProfileId_fkey" FOREIGN KEY ("technicalProfileId") REFERENCES "JobSeekerTechnicalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerWorkExperience" ADD CONSTRAINT "JobSeekerWorkExperience_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerExperience" ADD CONSTRAINT "JobSeekerExperience_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "JobSeekerWorkExperience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerPreferences" ADD CONSTRAINT "JobSeekerPreferences_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerEducation" ADD CONSTRAINT "JobSeekerEducation_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerEducationItem" ADD CONSTRAINT "JobSeekerEducationItem_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "JobSeekerEducation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerDocument" ADD CONSTRAINT "JobSeekerDocument_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeekerCulturePreferences" ADD CONSTRAINT "JobSeekerCulturePreferences_jobSeekerId_fkey" FOREIGN KEY ("jobSeekerId") REFERENCES "JobSeeker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts_media" ADD CONSTRAINT "posts_media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_likes" ADD CONSTRAINT "entity_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
