import { Response } from "express";
import jwt from "jsonwebtoken";

export const createAccessToken = (payload: {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "90d" });
};

export const sendTokenCookie = (
  payload: { id: string; name: string; email: string; isAdmin: boolean },
  res: Response,
  message: string,
  statusCode: number
) => {
  const accessToken = createAccessToken(payload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });

  res.status(statusCode).json({
    success: true,
    message,
  });
};
