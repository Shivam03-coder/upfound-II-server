import authRouter from "@src/module/auth/auth.route";
import communityRouter from "@src/module/community/community.route";
import jobSeekerRouter from "@src/module/job-seeker/job-seeker.routes";
import jobRouter from "@src/module/job/job.routes";
import recruiterRouter from "@src/module/recruiter/recruiter.routes";

export const routes = [
  {
    prefix: "auth",
    route: authRouter,
  },
  {
    prefix: "jobseeker",
    route: jobSeekerRouter,
  },
  {
    prefix: "community",
    route: communityRouter,
  },
  {
    prefix: "recruiter",
    route: recruiterRouter,
  },
  {
    prefix: "job",
    route: jobRouter,
  },
];
