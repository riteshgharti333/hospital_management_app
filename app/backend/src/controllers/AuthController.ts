import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import { createUser, getUserByEmail } from "../services/authService";
import { authSchema } from "@hospital/schemas";
import { validateWithZod } from "../utils/validateWithZod";
import { sendCookie } from "../utils/cookie";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "60d";

// 🔐 Register
export const register = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = validateWithZod(authSchema, req.body);

    const existingUser = await getUserByEmail(validated.email);
    if (existingUser) {
      return next(
        new ErrorHandler("Email already in use", StatusCodes.CONFLICT)
      );
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    const user = await createUser({
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User registered successfully",
      data: { id: user.id, name: user.name, email: user.email },
    });
  }
);

// 🔐 Login

export const login = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } =  req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return next(
        new ErrorHandler("Email not found", StatusCodes.UNAUTHORIZED)
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Invalid Email or Password", StatusCodes.UNAUTHORIZED)
      );
    }

    sendCookie(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      res,
      "Login successful",
      StatusCodes.OK
    );
  }
);


export const logout = catchAsyncError(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Clear the cookie by setting it to an empty string and expiring immediately
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "lax", // or 'none' if cross-site cookies are needed with `secure: true`
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // expire immediately
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Logout successful",
    });
  }
);