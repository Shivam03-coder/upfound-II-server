import { Router } from "express";
import uploader from "@src/core/middleware/upload.middleware";
import { requireAuth } from "@src/core/middleware/auth.middleware";
import JobSeekerController from "./job-seeker.controller";
const jobSeekerRouter = Router();
jobSeekerRouter.use(requireAuth)

jobSeekerRouter.post( "/profile", uploader ,JobSeekerController .userProfileInfoHandler)
jobSeekerRouter.get("/profile", JobSeekerController.getJobSeekerProfileHandler);
jobSeekerRouter.post("/profile-overview", JobSeekerController.profileOverviewHandler);
jobSeekerRouter.post("/culture", JobSeekerController.userCultureHandler);
jobSeekerRouter.put("/profile/picture" , uploader , JobSeekerController.updateUserProfilePicHandler);
jobSeekerRouter.post( "/resume", uploader, JobSeekerController.saveResumeHandler);
jobSeekerRouter.post("/preferences",JobSeekerController.preferencesHandler);
jobSeekerRouter.post("/projectLink", JobSeekerController.saveProjectLinksHandler);

export default jobSeekerRouter;
