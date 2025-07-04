import { prisma } from "../lib/prisma";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
};

export const createUser = async (data: RegisterInput) => {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUserDetails = async (
  id: string,
  data: { name?: string; email?: string }
) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUserPassword = async (
  id: string,
  hashedPassword: string
) => {
  return prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
