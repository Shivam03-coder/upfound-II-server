import { Router } from "express";
import uploader from "@src/core/middleware/upload.middleware";
import { requireAuth } from "@src/core/middleware/auth.middleware";
import JobSeekerController from "./job-seeker.controller";
const jobSeekerRouter = Router();

jobSeekerRouter.post( "/profile", uploader,requireAuth ,JobSeekerController .userProfileInfoHandler)
jobSeekerRouter .get("/profile", requireAuth, JobSeekerController.getJobSeekerProfileHandler);
jobSeekerRouter.post("/profile-overview", requireAuth, JobSeekerController.profileOverviewHandler);
jobSeekerRouter.post("/culture", requireAuth, JobSeekerController.userCultureHandler);
jobSeekerRouter.put("/profile/picture" , uploader,requireAuth , JobSeekerController.updateUserProfilePicHandler);
jobSeekerRouter.post( "/resume", uploader, requireAuth, JobSeekerController.saveResumeHandler);
jobSeekerRouter.post("/preferences", requireAuth, JobSeekerController.preferencesHandler);
jobSeekerRouter.post("/projectLink", requireAuth, JobSeekerController.saveProjectLinksHandler);

export default jobSeekerRouter;
