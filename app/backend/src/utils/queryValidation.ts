import { NextFunction } from "express";
import { StatusCodes } from "../constants/statusCodes";
import { ErrorHandler } from "../middlewares/errorHandler";

export const validateSearchQuery = (
  query: unknown,
  next: NextFunction,
  minLength: number = 2
): string | undefined => {
  if (typeof query !== "string" || query.trim().length < minLength) {
    next(
      new ErrorHandler(
        `Search query must be at least ${minLength} characters long`,
        StatusCodes.BAD_REQUEST
      )
    );
    return undefined;
  }
  return query.trim();
};
