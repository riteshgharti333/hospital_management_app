import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "./errorHandler";
import { StatusCodes } from "../constants/statusCodes";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(
      new ErrorHandler("Not authenticated", StatusCodes.UNAUTHORIZED)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      name: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch {
    return next(new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED));
  }
};
