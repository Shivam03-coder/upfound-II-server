import cors from "cors";
import express, {
  Application,
  ErrorRequestHandler,
  Request,
  Response,
  Router,
} from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Server } from "http";
import { envs } from "./configs/envs.config";
import { routes } from "./routes/root.route";
import { errorMiddleware } from "./middleware/error.middleware";

interface AppOptions {
  port?: number;
}

interface Route {
  path: string;
  router: Router;
}

class App {
  private readonly app: Application;
  private server?: Server;
  private readonly port: number;

  constructor(options?: AppOptions) {
    this.app = express();
    this.port = options?.port || Number(envs.PORT) || 3000;
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

    this.app.use(morgan("common"));

    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(cookieParser());

    this.app.use(
      cors({
        origin: envs.CLIENT_APP_URI,
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    this.app.enable("trust proxy");
  }

  private initializeRoutes(): void {
    routes.forEach((route) => {
      const fullPath = `/api/v1/${route.prefix}`;
      this.app.use(fullPath, route.route);
      console.log(`✅ Route registered: ${fullPath}`);
    });

    this.app.get("/health", (_req: Request, res: Response) => {
      res.status(200).json({
        status: "healthy",
        version: envs.VERSION,
      });
    });

    this.app.use((_req: Request, res: Response) => {
      res.status(404).json({ message: "Not Found" });
    });

    this.app.use(errorMiddleware);
  }
  public async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`
🚀 Server launched successfully!
🔗 Local: http://localhost:${this.port}

Health Check: http://localhost:${this.port}/health
        `);
        resolve();
      });
    });
  }

  public async close(): Promise<void> {
    try {
      if (this.server) {
        await new Promise<void>((resolve, reject) => {
          this.server?.close((err) => {
            if (err) {
              console.error("Error closing server:", err);
              return reject(err);
            }
            console.log("🛑 Express server closed");
            resolve();
          });
        });
      }
    } catch (error) {
      console.error("Error during shutdown:", error);
      throw error;
    }
  }

  public getAppInstance(): Application {
    return this.app;
  }

  public getServerInstance(): Server | undefined {
    return this.server;
  }
}

export default App;
