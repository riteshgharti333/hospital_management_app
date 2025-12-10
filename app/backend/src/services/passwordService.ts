import { prisma } from "../lib/prisma";
import crypto from "crypto";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};

export const saveOTP = async (email: string, otp: string) => {
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

  return prisma.user.update({
    where: { email },
    data: {
      resetToken: otp,
      resetTokenExpiry: expiry,
    },
  });
};

export const verifyOTPService = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.resetToken !== otp) return null;
  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) return null;

  const resetToken = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes valid
    },
  });

  return resetToken;
};

export const resetPasswordService = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  return user;
};
