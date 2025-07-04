import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "./errorHandler";
import { StatusCodes } from "../constants/statusCodes";
import { prisma } from "../lib/prisma";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new ErrorHandler("Login Required", StatusCodes.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.UNAUTHORIZED));
    }

    req.user = user;
    next();
  } catch {
    return next(new ErrorHandler("Invalid token", StatusCodes.UNAUTHORIZED));
  }
};
