import { Response } from "express";
import App from "./app";
import { envs } from "./common/configs/envs.config";
const appInstance = new App();
const expressApp = appInstance.getAppInstance();

(async () => {
  try {
    expressApp.get("/", (_req, res: Response) => {
      res
        .status(200)
        .json("Welcome to the server developed by Shivam Anand 🚀");
    });

    const port = envs.PORT || 3000;
    const server = expressApp.listen(port, () => {
      console.log(`✅ Server started at http://localhost:${port}`);
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`⚠️  Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log("🛑 Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
})();
