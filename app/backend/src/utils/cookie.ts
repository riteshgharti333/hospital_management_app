import jwt from "jsonwebtoken";
import { Response } from "express";

/**
 * Create Access Token (Short-Lived)
 */
export const createAccessToken = (payload: {
  id: string;
  regId: string;
  name: string;
  email: string;
  role: string;
}) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m", // 🔥 Hardcoded → FIXES TYPE ERROR
  });
};

/**
 * Create Refresh Token (Long-Lived)
 */
export const createRefreshToken = (payload: { id: string }) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d", // 🔥 Hardcoded → FIXES TYPE ERROR
  });
};

/**
 * Send JWT cookies
 */
export const sendTokenCookie = (
  payload: {
    id: string;
    regId: string;
    name: string;
    email: string;
    role: string;
  },
  res: Response,
  message: string,
  statusCode: number
) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken({ id: payload.id });

  // Access Token Cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh Token Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(statusCode).json({
    success: true,
    message,
    user: {
      id: payload.id,
      regId: payload.regId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
  });
};

////////////////////
