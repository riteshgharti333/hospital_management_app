// src/services/authService.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type RegisterInput = {
  name: string;
  email: string;
  password: string; // Already hashed before calling this service
};

// Create user (register)
export const createUser = async (data: RegisterInput) => {
  return prisma.user.create({ data });
};

// Get user by email (for login or checking duplicates)
export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

// Get user by ID (for auth middleware or profile)
export const getUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

// Optional: Update user details
export const updateUser = async (id: string, data: Partial<RegisterInput>) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

// Optional: Delete user (soft delete or full delete)
export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};
