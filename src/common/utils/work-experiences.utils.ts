import { Prisma } from "@prisma/client";
import { CreateprofileInformationData } from "@src/module/job-seeker/jobseeker.dto";

export async function upsertWorkExperiences(
  tx: Prisma.TransactionClient,
  userId: string,
  workExperiences: CreateprofileInformationData["workExperiences"]
) {
  if (!workExperiences || workExperiences.length === 0) return;

  const experience = await tx.experience.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  await tx.workExperience.deleteMany({
    where: { experienceId: experience.id },
  });
  await tx.workExperience.createMany({
    data: workExperiences.map((exp) => ({
      experienceId: experience.id,
      title: exp.title,
      employmentType: exp.employmentType,
      company: exp.company,
      startMonth: exp.startMonth,
      startYear: exp.startYear,
      endMonth: exp.endMonth,
      endYear: exp.endYear,
    })),
  });
}
