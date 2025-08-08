import { Request } from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";
import { envs } from "../configs/envs.config";
import { Readable } from "stream";

interface SignedUrlOptions {
  expiresIn?: number;
  isPublic?: boolean;
}

class S3Service {
  private s3: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.bucketName = envs.AWS_S3_BUCKET_NAME || "";
    this.region = envs.AWS_REGION || "";

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: envs.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: envs.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  async uploadFile(req: Request) {
    if (!req.file) {
      throw new Error("No file found in request");
    }

    const mimeType = req.file.mimetype;
    const fileName = req.file.originalname;
    const fileKey = `${uuidv4()}-${fileName}`;

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucketName,
        Key: fileKey,
        Body: bufferStream,
        ContentType: mimeType,
      },
    });

    try {
      await upload.done();
      return {
        message: "File uploaded successfully",
        key: fileKey,
        url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`,
        mimeType: mimeType,
        fileName: fileName,
        size: req.file.size,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file to S3");
    }
  }

  async getFileUrl(
    fileKey: string,
    options: SignedUrlOptions = {}
  ): Promise<{
    url: string;
    isPublic: boolean;
    expiresAt?: string;
    key: string;
  }> {
    if (!fileKey) {
      throw new Error("File key is required");
    }

    // Return public URL if configured
    if (options.isPublic) {
      return {
        url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`,
        isPublic: true,
        key: fileKey,
      };
    }

    // Generate signed URL
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    try {
      const expiresIn = options.expiresIn || 3600; // Default 1 hour
      const url = await getSignedUrl(this.s3, command, { expiresIn });

      return {
        url,
        isPublic: false,
        expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
        key: fileKey,
      };
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error("Failed to generate signed URL");
    }
  }

  async fileExists(fileKey: string): Promise<boolean> {
    try {
      await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: fileKey,
        })
      );
      return true;
    } catch (error: any) {
      if (error.name === "NoSuchKey") {
        return false;
      }
      throw error;
    }
  }
}

export const s3Service = new S3Service();
