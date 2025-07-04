import { Request, Response, NextFunction } from "express";
import "express";
import { ErrorHandler } from "./errorHandler";
import { StatusCodes } from "../constants/statusCodes";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return next(
      new ErrorHandler("Access denied: Admins only", StatusCodes.FORBIDDEN)
    );
  }

  next();
};
