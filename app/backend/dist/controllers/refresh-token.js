"use strict";
// import { NextFunction,Request,Response} from "express";
// import { catchAsyncError } from "../middlewares/catchAsyncError";
// import { ErrorHandler } from "../middlewares/errorHandler";
// import jwt from "jsonwebtoken"
// import { StatusCodes } from "../constants/statusCodes";
// import { createAccessToken } from "../utils/cookie";
// import { sendResponse } from "../utils/sendResponse";
// export const refreshAccessToken = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const refreshToken = req.cookies?.refreshToken;
//     if (!refreshToken) {
//       return next(new ErrorHandler("Refresh token missing", StatusCodes.UNAUTHORIZED));
//     }
//     try {
//       const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
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
//         secure: process.env.NODE_ENV === "production",
//         maxAge: 15 * 60 * 1000,
//       });
//       sendResponse(res, {
//         success: true,
//         statusCode: StatusCodes.OK,
//         message: "Access token refreshed",
//       });
//     } catch (error) {
//       return next(new ErrorHandler("Invalid or expired refresh token", StatusCodes.UNAUTHORIZED));
//     }
//   }
// );
