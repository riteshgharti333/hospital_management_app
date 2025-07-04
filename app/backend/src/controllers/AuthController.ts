import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserDetails,
  updateUserPassword,
} from "../services/authService";
import { createAccessToken, sendTokenCookie } from "../utils/cookie";
import { registerSchema, loginSchema } from "@hospital/schemas";

// REGISTER

export const register = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = registerSchema.parse(req.body);

    const existingUser = await getUserByEmail(validated.email);
    if (existingUser) {
      return next(
        new ErrorHandler("Email already in use", StatusCodes.CONFLICT)
      );
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    const isAdmin = validated.email === process.env.ADMIN_EMAIL;

    const user = await createUser({
      name: validated.name ?? "",
      email: validated.email,
      password: hashedPassword,
      isAdmin,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  }
);

// LOGIN
export const login = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = loginSchema.parse(req.body);

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

    sendTokenCookie(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin, // ✅ required for type safety
      },
      res,
      "Login successful",
      StatusCodes.OK
    );
  }
);

// LOGOUT
export const logout = catchAsyncError(async (_req: Request, res: Response) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });

sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Logout successfully",
  });
});

// GET MY PROFILE
export const getMyProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as any)?.id;

    if (!userId) {
      return next(new ErrorHandler("Unauthorized", StatusCodes.UNAUTHORIZED));
    }

    const user = await getUserById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User profile fetched successfully",
      data: user,
    });
  }
);

// UPDATE PROFILE
export const updateProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as any)?.id;
    const { name, email } = req.body;

    if (!userId) {
      return next(new ErrorHandler("Unauthorized", StatusCodes.UNAUTHORIZED));
    }

    const updatedUser = await updateUserDetails(userId, { name, email });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  }
);

// CHANGE PASSWORD
export const changePassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as any)?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return next(new ErrorHandler("Unauthorized", StatusCodes.UNAUTHORIZED));
    }

    const user = await getUserById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(
        new ErrorHandler("Old password is incorrect", StatusCodes.UNAUTHORIZED)
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await updateUserPassword(userId, hashedNewPassword);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password updated successfully",
    });
  }
);

// // REFRESH ACCESS TOKEN
// export const refreshAccessToken = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const refreshToken = req.cookies?.refreshToken;

//     if (!refreshToken) {
//       return next(
//         new ErrorHandler("Refresh token missing", StatusCodes.UNAUTHORIZED)
//       );
//     }

//     try {
//       const decoded = jwt.verify(
//         refreshToken,
//         process.env.JWT_REFRESH_SECRET!
//       ) as {
//         id: string;
//         name: string;
//         email: string;
//       };

//       const newAccessToken = createAccessToken({
//         id: decoded.id,
//         name: decoded.name,
//         email: decoded.email,
//       });

//       res.cookie("accessToken", newAccessToken, {
//         httpOnly: true,
//         sameSite: "lax",
//         secure: process.env.NODE_ENV === "development",
//         maxAge: 60 * 60 * 1000,
//       });

//       sendResponse(res, {
//         success: true,
//         statusCode: StatusCodes.OK,
//         message: "Access token refreshed",
//       });
//     } catch (error) {
//       return next(
//         new ErrorHandler(
//           "Invalid or expired refresh token",
//           StatusCodes.UNAUTHORIZED
//         )
//       );
//     }
//   }
// );
