import { Router } from "express";
import uploader from "@src/core/middleware/upload.middleware";
import { requireAuth } from "@src/core/middleware/auth.middleware";
import JobSeekerController from "./job-seeker.controller";
const jobSeekerRouter = Router();

jobSeekerRouter.post( "/profile", uploader,requireAuth ,JobSeekerController .userProfileInfoHandler)
// jobSeekerRouter .get("/profile", requireAuth, JobSeekerController.)
jobSeekerRouter.post("/profile-overview", requireAuth, JobSeekerController.profileOverviewHandler)
// jobSeekerRouter.post("/culture", requireAuth, UserController.userCultureHandler)
// jobSeekerRouter.put(
//     uploader, requireAuth
//     requireAuth,
//     UserController.updateUserProfile
//   )
//   jobSeekerRouter.post(
//     "/resume",
//     uploader, requireAuth
//     UserController.uploadResumeHandler
//   )
//   jobSeekerRouter.post("/preferences", requireAuth, UserController.userPreferencesHandler)
//   jobSeekerRouter.post("/projectLink", requireAuth, UserController.updateProjectLinksHandler);

export default jobSeekerRouter;
