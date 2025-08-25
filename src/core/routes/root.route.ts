import adminRouter from "@src/module/admin/admin.route";
import authRouter from "@src/module/auth/auth.route";
import communityRouter from "@src/module/community/community.route";
import jobSeekerRouter from "@src/module/job-seeker/job-seeker.routes";
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
    prefix: "admin",
    route: adminRouter,
  },
  {
    prefix: "community",
    route: communityRouter,
  },
  {
    prefix: "recruiter",
    route: recruiterRouter,
  },
];
