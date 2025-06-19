import { Response } from "express";
import jwt from "jsonwebtoken";

interface Payload {
  id: string;
}

export const sendCookie = (
  user: { id: string; name: string; email: string },
  res: Response,
  message: string,
  statusCode: number = 200
) => {
  const token = jwt.sign(
    { id: user.id } as Payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  res
    .status(statusCode)
    .cookie("hospital-token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secure: process.env.NODE_ENV !== "development",
    })
    .json({
      success: true,
      message,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
};
