import {
  ApiResponse,
  AsyncHandler,
  getAuth,
} from "@src/common/utils/api.utils";
import { Request, Response } from "express";
import { CreateJobDTO, JobApplyDto } from "./job.dto";
import JobService from "./job.service";
import { getResumeUrl } from "@src/common/utils/get-resume-url.utils";
import parseAnswers from "@src/common/utils/parse-answers.utils";

class JobController {
  public static createJobHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = await getAuth(req);
      const data = req.body as CreateJobDTO;
      const resp = await JobService.createJob({ ...data, userId });
      res.status(200).json(new ApiResponse(resp.message, resp.job));
    }
  );

  public static editJobHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { jobId } = req.params;
      const data = req.body as CreateJobDTO;
      const resp = await JobService.editJob({ dto: data, jobId });
      res.status(200).json(new ApiResponse(resp.message, resp.job));
    }
  );
  public static applyForJobHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { jobId } = req.params;
      const { userId } = await getAuth(req);
      const data = req.body as JobApplyDto;
      const resumeUrl = await getResumeUrl(data.resumeUrl, req);
      const answers = parseAnswers(data.answerRaw);
      // res.status(200).json(new ApiResponse(resp.message, resp.job));
    }
  );

  public static getJobApplicantsHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static getCandidateHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static getJobByIdHanlder = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static getJobsByCompanyIdHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static getPopularJobsHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static getNewJobsHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static getProfileBasedJobsHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static getAllStartups = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static getStartupDetailsById = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  static getSimilarJobsHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  static applyJobHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  static getAllUniqueSkills = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  static updateJobStatus = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  static updateApplicantJobStatus = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  static updateCandidateApplicantJobStatus = AsyncHandler(
    async (req: Request, res: Response) => {}
  );
}

export default JobController;
