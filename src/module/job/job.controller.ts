import {
  ApiResponse,
  AsyncHandler,
  getAuth,
} from "@src/common/utils/api.utils";
import { Request, Response } from "express";
import { CreateJobDTO } from "./job.dto";
import JobService from "./job.service";

class JobController {
  public static createJobHandler = AsyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = await getAuth(req);
      const data = req.body as CreateJobDTO;
      const resp = await JobService.createJob({ ...data, userId });
      res.status(200).json(new ApiResponse(resp.message, resp.job));
    }
  );

  public static getJobApplicantsHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static getCandidateHandler = AsyncHandler(
    async (req: Request, res: Response) => {}
  );

  public static editJobHandler = AsyncHandler(
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
