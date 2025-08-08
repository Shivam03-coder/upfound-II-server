import adminRouter from "@src/module/admin/admin.route";
import communityRouter from "@src/module/community/community.route";

export const routes = [
  {
    prefix: "admin",
    route: adminRouter,
  },
  {
    prefix: "community",
    route: communityRouter,
  },
];
