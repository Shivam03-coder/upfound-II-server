import {
  ApiResponse,
  AsyncHandler,
  getAuth,
} from "@src/common/utils/api.utils";
import { CompanyProfileData, RecruiterData } from "./recruiter.dto";
import { Request, Response } from "express";
import RecruiterService from "./recruiter.service";
import { s3Service } from "@src/common/libs/s3";

class RecruiterController {
  public static createProfileHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data = req.body as RecruiterData;
      const { userId } = await getAuth(req);
      let profilePicture = "";
      if (req.file) {
        profilePicture = (await s3Service.uploadFile(req)).url ?? "";
      }
      const resp = await RecruiterService.createProfile({
        ...data,
        userId,
        profilePicture,
      });
      res.status(201).json(new ApiResponse(resp.message, resp.recruiter));
    }
  );

  public static getProfileHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { userId } = await getAuth(req);
      const resp = await RecruiterService.getProfile(userId);
      res.status(200).json(new ApiResponse(resp.message, resp.recruiter));
    }
  );

  public static updateProfileHandler = AsyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const data = req.body as RecruiterData;
      const { userId } = await getAuth(req);
      let profilePicture = data.profilePicture ?? "";
      if (req.file) {
        profilePicture = (await s3Service.uploadFile(req)).url ?? "";
      }
      const resp = await RecruiterService.updateProfile({
        ...data,
        userId,
        profilePicture,
      });
      res.status(200).json(new ApiResponse(resp.message, resp.recruiter));
    }
  );

  // public static createCompanyHandler = AsyncHandler(
  //   async (req: Request, res: Response): Promise<void> => {
  //     const data = req.body as CompanyProfileData;
  //     const { userId } = await getAuth(req);
  //     let companyPic;
  //     if (req.file) {
  //       companyPic = (await s3Service.uploadFile(req)).url ?? "";
  //     }
  //     const resp = await RecruiterService.createCompany({
  //       ...data,
  //       companyPic,
  //     });
  //   }
  // );
}

export default RecruiterController;
