import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError";
import { ErrorHandler } from "./errorHandler";

interface JwtPayload {
  id: number;
  iat: number;
  exp: number;
}

export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      return next(new ErrorHandler("Unauthorized: No token provided", 401));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret_key"
      ) as JwtPayload;

      req.user = { id: decoded.id };

      next();
    } catch (err) {
      return next(new ErrorHandler("Unauthorized: Invalid or expired token", 401));
    }
  }
);
