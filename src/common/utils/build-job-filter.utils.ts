import { Request } from "express";
import { Prisma } from "@prisma/client";

export function buildJobFilters(req: Request): Prisma.JobWhereInput {
  const filter: Prisma.JobWhereInput = {};

  if (req.query.workExperience) {
    filter.workExperience = String(req.query.workExperience);
  }

  if (req.query.minSalary) {
    const minSalary = parseInt(req.query.minSalary as string, 10);
    if (!isNaN(minSalary)) {
      filter.salaryFrom = { gte: minSalary };
    }
  }

  if (req.query.workMode) {
    filter.workMode = String(req.query.workMode);
  }

  if (req.query.skills) {
    const skills =
      typeof req.query.skills === "string"
        ? req.query.skills.split(",").map((s) => s.trim())
        : [];

    if (skills.length > 0) {
      filter.skills = {
        some: {
          skill: {
            name: {
              in: skills,
            },
          },
        },
      };
    }
  }

  return filter;
}
