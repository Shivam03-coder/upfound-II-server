import {
  ApiResponse,
  AsyncHandler,
  getAuth,
} from "@src/common/utils/api.utils";
import { Request, Response } from "express";
import {
  CreateprofileInformationData,
  CreateprofileOverviewData,
  JobPreferences,
  PreferencesData,
  ProjectLinkData,
} from "./jobseeker.dto";
import { JobSeekerService } from "./job-seeker.service";
import { s3Service } from "@src/common/libs/s3";

class JobSeekerController {
  public static userProfileInfoHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const data = req.body as CreateprofileInformationData;
      const { userId } = await getAuth(req);

      let profilePicture = "";
      if (req.file) {
        profilePicture = (await s3Service.uploadFile(req)).url ?? "";
      }

      const resp = await JobSeekerService.saveUserProfileInfo({
        ...data,
        userId,
        profilePicture,
      });

      res.status(200).json(new ApiResponse(resp.message, resp.user));
    }
  );

  public static profileOverviewHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const data = req.body as CreateprofileOverviewData;
      const { userId } = await getAuth(req);
      let profilePicture = "";
      if (req.file) {
        profilePicture = (await s3Service.uploadFile(req)).url ?? "";
      }
      const resp = await JobSeekerService.saveUserProfileOverview({
        ...data,
        userId,
        profilePicture,
      });

      res
        .status(200)
        .json(new ApiResponse("User profile overview saved successfully"));
    }
  );

  public static preferencesHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = await getAuth(req);
      const data = req.body as PreferencesData;
      const resp = await JobSeekerService.savePreferences({ ...data, userId });
      res.status(200).json(new ApiResponse(resp.message, resp.preference));
    }
  );

  public static userCultureHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = await getAuth(req);
      const data = req.body as JobPreferences;
      const resp = await JobSeekerService.saveJobCulture({ ...data, userId });
      res.status(200).json(new ApiResponse(resp.message, resp.culture));
    }
  );

  public static saveResumeHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = await getAuth(req);

      let resumeUrl = "";
      if (req.file) {
        resumeUrl = (await s3Service.uploadFile(req)).url ?? "";
      }
      const resp = await JobSeekerService.saveResume({ resumeUrl, userId });
      res.status(200).json(new ApiResponse(resp.message, resp.docs));
    }
  );

  public static getJobSeekerProfileHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = await getAuth(req);
      const resp = await JobSeekerService.getJobSeekerProfile({ userId });
      res
        .status(200)
        .json(new ApiResponse("User profile fetched successfully", resp));
    }
  );

  public static saveProjectLinksHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = await getAuth(req);
      const data = req.body as ProjectLinkData;
      const resp = await JobSeekerService.saveProjectLinks({ ...data, userId });
      res.status(200).json(new ApiResponse(resp.message, resp.culture));
    }
  );

  public static updateUserProfilePicHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = await getAuth(req);

      let profilePicture = "";
      if (req.file) {
        profilePicture = (await s3Service.uploadFile(req)).url ?? "";
      }
      const resp = await JobSeekerService.updateProfilePicture({
        profilePicture,
        userId,
      });

      res.status(200).json(new ApiResponse(resp.message, resp.jobseeker));
    }
  );
}

export default JobSeekerController;
