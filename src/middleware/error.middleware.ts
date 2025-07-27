import { AppError } from "@src/utils/error.utils";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    console.log(`[AppError] ${req.method} ${req.url} - ${err.message}`);
    res.status(err.statusCode).json({
      status: err.isOperational ? "failed" : "error",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  console.error(`[UnhandledError] ${req.method} ${req.url} -`, err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
