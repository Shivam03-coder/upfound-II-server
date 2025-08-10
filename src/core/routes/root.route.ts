import adminRouter from "@src/module/admin/admin.route";
import authRouter from "@src/module/auth/auth.route";
import communityRouter from "@src/module/community/community.route";

export const routes = [
  {
    prefix: "auth",
    route: authRouter,
  },
  {
    prefix: "admin",
    route: adminRouter,
  },
  {
    prefix: "community",
    route: communityRouter,
  },
];
