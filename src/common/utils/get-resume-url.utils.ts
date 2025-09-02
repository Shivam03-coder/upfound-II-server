// utils/getResumeUrl.ts
import { Request } from "express";
import { s3Service } from "../libs/s3";

export const getResumeUrl = async (
  dtoResumeUrl: unknown,
  req: Request
): Promise<string | null> => {
  if (dtoResumeUrl && typeof dtoResumeUrl === "string") {
    return dtoResumeUrl;
  }

  try {
    const { url } = await s3Service.uploadFile(req);
    return url;
  } catch (err) {
    throw new Error("Failed to retrieve resume from Cloudinary");
  }
};
