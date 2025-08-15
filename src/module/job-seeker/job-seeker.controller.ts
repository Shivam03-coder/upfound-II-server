import {
  ApiResponse,
  AsyncHandler,
  getAuth,
} from "@src/common/utils/api.utils";
import { Request, Response } from "express";
import {
  CreateprofileInformationData,
  CreateprofileOverviewData,
} from "./jobseeker.dto";
import { UserService } from "./job-seeker.service";
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

      const resp = await UserService.saveUserProfileInfo({
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

      const resp = await UserService.saveUserProfileOverview({
        ...data,
        userId,
      });

      res
        .status(200)
        .json(new ApiResponse("User profile overview saved successfully"));
    }
  );

  //   public static userPreferencesHandler = AsyncHandler(
  //     async (req: Request, res: Response) => {
  //       const { userId } = await getAuth(req);
  //       const {
  //         activelyLooking,
  //         jobType,
  //         startupStagePreference,
  //         workArrangement,
  //       } = UserdataValidation.userPreferenceData(req.body);

  //       await userPreferenceModel.findOneAndUpdate(
  //         { userId },
  //         {
  //           $set: {
  //             activelyLooking,
  //             jobType,
  //             startupStagePreference,
  //             workArrangement,
  //           },
  //         },
  //         { upsert: true, new: true }
  //       );

  //       res
  //         .status(200)
  //         .json(new ApiResponse("User prefrences saved succesfully"));
  //     }
  //   );

  //   public static userCultureHandler = AsyncHandler(
  //     async (req: Request, res: Response) => {
  //       const { userId } = await getAuth(req);
  //       const updateData = UserdataValidation.userCultureData(req.body);

  //       if (Object.keys(updateData).length > 0) {
  //         await userCultureModel.findOneAndUpdate(
  //           { userId },
  //           { $set: updateData },
  //           { upsert: true, new: true }
  //         );
  //       }

  //       res
  //         .status(200)
  //         .json(new ApiResponse("User culture preferences saved successfully"));
  //     }
  //   );

  //   public static uploadResumeHandler = AsyncHandler(
  //     async (req: Request, res: Response) => {
  //       const { userId } = await getAuth(req);

  //       const resumeUrl = await CloudinaryService.getFileUrl(req);

  //       if (!resumeUrl) {
  //         throw new ValidationError("Resume upload failed or no file provided.");
  //       }

  //       await userDocsModel.findOneAndUpdate(
  //         { userId },
  //         {
  //           $set: {
  //             documentUrl: resumeUrl,
  //             updatedAt: new Date(),
  //           },
  //         },
  //         { upsert: true, new: true }
  //       );

  //       res.status(200).json(new ApiResponse("Resume uploaded successfully"));
  //     }
  //   );

  //   public static getUserProfileHandler = AsyncHandler(
  //     async (req: Request, res: Response) => {
  //       const { userId } = await getAuth(req);

  //       const userCulture = await userCultureModel
  //         .findOne({ userId })
  //         .lean()
  //         .exec();
  //       const userPreference = await userPreferenceModel
  //         .findOne({ userId })
  //         .lean()
  //         .exec();
  //       const userDocs = await userDocsModel.findOne({ userId }).lean().exec();

  //       const userProfile = await userProfileModel
  //         .findOne({ _id: userId })
  //         .lean()
  //         .exec();

  //       const userTechnicalProfile = await userTechnicalProfileModel
  //         .findOne({
  //           userId,
  //         })
  //         .lean()
  //         .exec();
  //       const userEducation = await userEducationModel
  //         .find({ userId })
  //         .lean()
  //         .exec();
  //       const workExperience = await userWorkExperinceModel
  //         .find({ userId })
  //         .lean()
  //         .exec();

  //       const socialLinks = await userSocialLinksModel
  //         .find({ userId })
  //         .lean()
  //         .exec();

  //       const user = {
  //         ...userProfile,
  //         ...userPreference,
  //         ...userCulture,
  //         ...userDocs,
  //         ...userTechnicalProfile,
  //         userEducation,
  //         workExperience,
  //         ...socialLinks,
  //       };

  //       res
  //         .status(200)
  //         .json(new ApiResponse("User profile fetched successfully", user));
  //     }
  //   );

  //   public static updateProjectLinksHandler = AsyncHandler(
  //     async (req: Request, res: Response) => {
  //       const { userId } = await getAuth(req);

  //       const links: string[] = req.body.links;

  //       if (!Array.isArray(links)) {
  //         throw new ValidationError("Links must be an array of URLs.");
  //       }

  //       if (links.length > 3) {
  //         throw new ValidationError("Only up to 3 project links are allowed.");
  //       }

  //       const projectLinkMap = new Map<string, string>();

  //       links.forEach((url, index) => {
  //         if (typeof url !== "string" || !url.startsWith("http")) {
  //           throw new ValidationError(`Invalid URL at index ${index}`);
  //         }
  //         projectLinkMap.set(index.toString(), url);
  //       });

  //       await userSocialLinksModel.findOneAndUpdate(
  //         { userId },
  //         {
  //           $set: {
  //             projectLink: projectLinkMap,
  //             updatedAt: new Date(),
  //           },
  //         },
  //         { upsert: true, new: true }
  //       );

  //       res
  //         .status(200)
  //         .json(new ApiResponse("Project links updated successfully"));
  //     }
  //   );

  //   public static updateUserProfile = AsyncHandler(
  //     async (req: Request, res: Response) => {
  //       const { userId } = await getAuth(req);

  //       const profilePicture = await CloudinaryService.getFileUrl(req);

  //       await userProfileModel.findOneAndUpdate(
  //         {
  //           _id: userId,
  //         },
  //         {
  //           $set: {
  //             profilePicture,
  //           },
  //         }
  //       );

  //       res.status(200).json(new ApiResponse("Profile updated successfully"));
  //     }
  //   );
}

export default JobSeekerController;
