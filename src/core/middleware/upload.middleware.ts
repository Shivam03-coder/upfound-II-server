import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { ValidationError } from "@src/common/utils/error.utils";

const uploadsDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export class UploadMiddleware {
  private static readonly allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    // Videos
    "video/mp4",
    "video/webm",
    "video/quicktime",
    // Documents
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  ];

  private static readonly maxFileSize = 50 * 1024 * 1024;

  private static fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    if (UploadMiddleware.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ValidationError(
          `Unsupported file type: ${file.mimetype}. Only images, videos and PDFs are allowed.`
        )
      );
    }
  }

  public static createUploader(fieldName: string = "file") {
    return multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: UploadMiddleware.maxFileSize,
        files: 1,
      },
      fileFilter: UploadMiddleware.fileFilter,
    }).single(fieldName);
  }

  public static createDiskUploader(fieldName: string = "file") {
    return multer({
      storage: multer.diskStorage({
        destination: uploadsDir,
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname.replace(
            /\s+/g,
            "-"
          )}`;
          cb(null, uniqueName);
        },
      }),
      limits: {
        fileSize: UploadMiddleware.maxFileSize,
        files: 1,
      },
      fileFilter: UploadMiddleware.fileFilter,
    }).single(fieldName);
  }
}

export default UploadMiddleware.createUploader();
