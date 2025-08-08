import { envs } from "@src/common/configs/envs.config";
import { SessionUser } from "@src/common/types/global.types";
import { ApiResponse } from "@src/common/utils/api.utils";
import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { db } from "../database";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res
        .status(401)
        .json(new ApiResponse("Access denied. No access token provided."));
      return;
    }

    const decoded = jwt.verify(token, envs.ACCESS_TOKEN_SECRET!) as SessionUser;

    if (!decoded || !decoded.id || !decoded.role) {
      res
        .status(401)
        .json(new ApiResponse("Unauthorized! Invalid or malformed token."));
      return;
    }

    const account = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!account) {
      res
        .status(401)
        .json(new ApiResponse("User not found. Please log in again."));
      return;
    }

    (req as any).user = account;

    return next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(403).json(new ApiResponse("Invalid or expired access token."));
      return;
    }

    res
      .status(500)
      .json(new ApiResponse("Internal server error while authenticating."));
    return;
  }
};
