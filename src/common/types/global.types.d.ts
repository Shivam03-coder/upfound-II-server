import { File } from "multer";
import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: SessionUser;
      file?: File;
      files?: File[];
    }
  }
}

export interface SessionUser {
  id: string;
  role: UserRole;
}

export {};


export interface IUploadResult {
  success: boolean;
  message: string;
  key: string;
  fileName: string;
  url: string;
  mimeType: string;
}

export interface ISignedUrlResult {
  success: boolean;
  url: string;
  expiresAt: string;
  key: string;
}
