import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ErrorHandler } from "./errorHandler";
import mongoose from "mongoose";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message: string | string[] = "Internal Server Error";

  // ZOD Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
  }
  // Custom ErrorHandler
  else if (err instanceof ErrorHandler) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Mongoose Validation
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors).map((val: any) => val.message);
  }
  // Duplicate Key Error (for Mongoose/Prisma)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field: ${field}`;
  } else {
    console.error("Unhandled Error 💥", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};
