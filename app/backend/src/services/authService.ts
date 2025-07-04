import { prisma } from "../lib/prisma";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
};

export const createUser = async (data: RegisterInput) => {
  return prisma.user.create({ data });
};

// Get user by email (for login or checking duplicates)
export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

// Get user by ID
export const getUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

// Update user (name and email)
export const updateUserDetails = async (
  id: string,
  data: { name?: string; email?: string }
) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

// Update password
export const updateUserPassword = async (
  id: string,
  hashedPassword: string
) => {
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};
