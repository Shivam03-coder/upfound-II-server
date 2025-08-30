import { requireAuth } from "@src/core/middleware/auth.middleware";
import { Router } from "express";
import JobController from "./job.controller";
import uploader from "@src/core/middleware/upload.middleware";
const jobRouter = Router();
jobRouter.use(requireAuth)

jobRouter.post("/create", JobController.createJobHandler);
jobRouter.get("/popular", JobController.getPopularJobsHandler);
jobRouter.get("/newJobs", JobController.getNewJobsHandler);
jobRouter.get("/profileBased-jobs",JobController.getProfileBasedJobsHandler);
jobRouter.get("/all-startups", JobController.getAllStartups);
jobRouter.get("/startup/:startupId",JobController.getStartupDetailsById);
jobRouter.post("/apply/:jobId",uploader,JobController.applyJobHandler);
jobRouter.get("/applied-jobs",JobController.applyJobHandler);
jobRouter.get("/similar-jobs/:jobId",JobController.getSimilarJobsHandler);
jobRouter.get("/job-skills", JobController.getAllUniqueSkills);
jobRouter.get("/unique-skills", JobController.getAllUniqueSkills);
jobRouter.get("/company/:companyId",JobController.getJobsByCompanyIdHandler);
jobRouter.put("/:jobId", JobController.editJobHandler);
jobRouter.get("/company", JobController.getJobsByCompanyIdHandler);
jobRouter.post("/company/jobapplicants",JobController.getJobApplicantsHandler);
jobRouter.post("/company/candidatedata",JobController.getCandidateHandler);
jobRouter.post("/update-status", JobController.updateJobStatus);
jobRouter.post("/applicationstatus",JobController.updateApplicantJobStatus);
jobRouter.post("/candidate/applicationStatus",JobController.updateCandidateApplicantJobStatus);
export default jobRouter;
