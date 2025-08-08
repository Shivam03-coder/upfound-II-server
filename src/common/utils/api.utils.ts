import { Request, Response, NextFunction } from "express";
import { AuthError } from "./error.utils";
import { db } from "@src/core/database";

export const AsyncHandler = (
  asyncFunction: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncFunction(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export class ApiResponse<T = any> {
  public status: "success";
  public message: string;
  public result?: T;

  constructor(message: string, data?: T) {
    this.status = "success";
    this.message = message;
    this.result = data;
  }
}

export const getAuth = async (req: Request) => {
  if (!req.user || !req.user.id) {
    throw new AuthError("Unauthorized access. User info not found.");
  }

  const userId = req.user.id;

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AuthError("User not found in the database.");
  }

  return {
    userId: user.id,
    role: user.role,
  };
};
