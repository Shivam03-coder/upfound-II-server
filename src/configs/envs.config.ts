import { config } from "dotenv";
import { version } from "../../package.json";

config();

type Environment = "development" | "production" | "test" | "staging";

export const envs = {
  NODE_ENV: (process.env.NODE_ENV || "development") as Environment,
  PORT: parseInt(process.env.PORT || "3000", 10),
  VERSION: process.env.APP_VERSION || version,
  DB_URI: process.env.MONGO_URI as string,
  CLIENT_APP_URI: process.env.CLIENT_APP_URI as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
};
