import { envs } from "@src/configs/envs.config";
import { ValidationError } from "@src/utils/error.utils";
import { v2 as cloudinary } from "cloudinary";
import { Request } from "express";
import { promises as fs } from "fs";

cloudinary.config({
  cloud_name: envs.CLOUDINARY_CLOUD_NAME,
  api_key: envs.CLOUDINARY_API_KEY,
  api_secret: envs.CLOUDINARY_API_SECRET,
});

type ImagePath = string | string[];

class CloudinaryService {
  private static async uploadSingleImage(
    imagePath: string,
    attempt = 1
  ): Promise<string | null> {
    try {
      await fs.access(imagePath);

      const uploadResponse = await cloudinary.uploader.upload(imagePath, {
        resource_type: "auto",
        timeout: 120000,
      });

      return uploadResponse.secure_url;
    } catch (error: any) {
      console.error(`Upload failed for ${imagePath} (Attempt ${attempt}):`, {
        name: error?.name,
        message: error?.message,
        http_code: error?.http_code,
        stack: error?.stack,
      });

      const shouldRetry =
        attempt < 3 &&
        (error?.name === "TimeoutError" || error?.http_code === 499);

      if (shouldRetry) {
        console.warn(
          `Retrying upload for ${imagePath} (Attempt ${attempt + 1})...`
        );
        return this.uploadSingleImage(imagePath, attempt + 1);
      }

      return null;
    } finally {
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn("Failed to delete local file:", err);
      }
    }
  }

  private static async uploadImages(
    imagePaths: ImagePath
  ): Promise<string | string[] | null> {
    if (!imagePaths || (Array.isArray(imagePaths) && imagePaths.length === 0)) {
      console.error("No file path provided");
      return null;
    }

    const paths = Array.isArray(imagePaths) ? imagePaths : [imagePaths];

    try {
      const uploadPromises = paths.map((imagePath) =>
        this.uploadSingleImage(imagePath)
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      return uploadedUrls.length === 1
        ? uploadedUrls[0]
        : uploadedUrls.filter((url) => url !== null);
    } catch (error) {
      console.error("Error in CloudinaryService.uploadImages:", error);
      return null;
    }
  }

  public static getImageUrl = async (req: Request): Promise<string | null> => {
    try {
      console.log(req.file?.path);
      if (req.file?.path) {
        const uploadedImage = await this.uploadImages(req.file.path);

        if (!uploadedImage) {
          throw new ValidationError("Image upload failed");
        }

        return uploadedImage as string;
      }

      return null;
    } catch (error: any) {
      throw new ValidationError(
        error.message || "An error occurred while uploading the image"
      );
    }
  };
}

export default CloudinaryService;
