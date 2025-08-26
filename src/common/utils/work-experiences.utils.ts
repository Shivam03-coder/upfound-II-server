import { Prisma } from "@prisma/client";
import { CreateprofileInformationData } from "@src/module/job-seeker/jobseeker.dto";

export async function upsertWorkExperiences(
  tx: Prisma.TransactionClient,
  userId: string,
  workExperiences: any
) {
  try {
    const parsedWorkExperiences = (
      typeof workExperiences === "string"
        ? JSON.parse(workExperiences)
        : workExperiences
    ) as CreateprofileInformationData["workExperiences"];

    console.log(parsedWorkExperiences);
    if (!parsedWorkExperiences || parsedWorkExperiences.length === 0) return;

    const experience = await tx.experience.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId },
    });

    await tx.workExperience.deleteMany({
      where: { experienceId: experience.id },
    });
    await tx.workExperience.createMany({
      data: parsedWorkExperiences.map((exp) => ({
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
  } catch (error) {
    console.log(error);
    throw error;
  }
}
