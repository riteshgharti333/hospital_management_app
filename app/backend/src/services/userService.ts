import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export type CreateUserInput = {
  regId: string;
  name: string;
  email: string;
  role: "DOCTOR" | "NURSE"; // 👈 now supports both
  password: string;
};

export const createUserLogin = async (data: CreateUserInput) => {
  return prisma.user.create({
    data: {
      ...data,
      isActive: false,
      mustChangePassword: true,
    },
  });
};

export const getUserByRegId = async (regId: string) => {
  return prisma.user.findUnique({ where: { regId } });
};

export type StaffRole = "DOCTOR" | "NURSE";

export type GetAllUsersParams = {
  role?: StaffRole;
  skip?: number;
  take?: number;
};

const STAFF_ROLES: StaffRole[] = ["DOCTOR", "NURSE"];

const sanitizeUser = (u: any) => ({
  id: u.id,
  regId: u.regId ?? null,
  name: u.name,
  email: u.email,
  role: u.role,
  mustChangePassword: u.mustChangePassword ?? false,
  status: u.isActive ? "active" : "disabled",
  permissions: u.permissions ?? {},
  createdAt: u.createdAt?.toISOString?.() ?? String(u.createdAt),
  updatedAt: u.updatedAt?.toISOString?.() ?? String(u.updatedAt),
});

export const getUsersAggregated = async (params: GetAllUsersParams) => {
  const { role, skip = 0, take = 25 } = params;

  const where: any = {
    role: { in: STAFF_ROLES },
  };

  if (role && STAFF_ROLES.includes(role)) {
    where.role = role;
  }

  const [allUsers, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { name: "asc" },
    }),
    prisma.user.count({ where }),
  ]);

  const [activeAccess, deniedAccess] = await Promise.all([
    prisma.user.count({ where: { ...where, isActive: true } }),
    prisma.user.count({ where: { ...where, isActive: false } }),
  ]);

  const groupData = await Promise.all(
    STAFF_ROLES.map(async (r) => {
      const users = await prisma.user.findMany({
        where: { role: r },
        orderBy: { name: "asc" },
      });

      return {
        role: r,
        count: users.length,
        users: users.map(sanitizeUser),
      };
    })
  );

  const grouped = {
    doctor: groupData.find((g) => g.role === "DOCTOR") ?? {
      count: 0,
      users: [],
    },
    nurse: groupData.find((g) => g.role === "NURSE") ?? {
      count: 0,
      users: [],
    },
  };

  return {
    all: {
      users: allUsers.map(sanitizeUser),
      total: totalUsers,
    },
    staff: grouped,
    totalUsers,
    activeAccess,
    deniedAccess,
  };
};

export const regenerateTempPassword = async (regId: string) => {
  const user = await prisma.user.findUnique({
    where: { regId },
  });

  if (!user) {
    return null;
  }

  if (!["DOCTOR", "NURSE"].includes(user.role)) {
    throw new Error("Temp password allowed only for staff users");
  }

  // 🔐 Generate new temp password
  const prefix = user.role === "DOCTOR" ? "Doc@" : "Nur@";
  const tempPassword = prefix + Math.floor(100000 + Math.random() * 900000);

  const hashed = await bcrypt.hash(tempPassword, 12);

  // 🔄 Update user credentials
  await prisma.user.update({
    where: { regId },
    data: {
      password: hashed,
      tempPasswordHash: hashed,
      mustChangePassword: true,
    },
  });

  return {
    regId: user.regId,
    tempPassword,
  };
};

export const deleteUserByRegId = async (regId: string) => {
  const user = await prisma.user.findUnique({
    where: { regId },
  });

  if (!user) {
    return null;
  }

  if (user.role === "ADMIN") {
    throw new Error("ADMIN_DELETE_NOT_ALLOWED");
  }

  await prisma.user.delete({
    where: { regId },
  });

  return {
    regId: user.regId,
    role: user.role,
    name: user.name,
  };
};
