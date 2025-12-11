import { prisma } from "../lib/prisma";

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
    }
   });
};

export const getUserByRegId = async (regId: string) => {
  return prisma.user.findUnique({ where: { regId } });
};



export type GetAllUsersParams = {
  role?: "ADMIN" | "DOCTOR" | "NURSE";
  skip?: number;
  take?: number;
};

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

  const where: any = {};
  if (role) where.role = role;

  // Fetch paginated ALL users
  const [allUsers, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { name: "asc" },
    }),
    prisma.user.count({ where }),
  ]);

  // Count active/disabled users
  const [activeAccess, deniedAccess] = await Promise.all([
    prisma.user.count({ where: { ...where, isActive: true } }),
    prisma.user.count({ where: { ...where, isActive: false } }),
  ]);

  // Fetch grouped lists (no pagination)
  const roles: Array<"ADMIN" | "DOCTOR" | "NURSE"> = ["ADMIN", "DOCTOR", "NURSE"];

  const groupData = await Promise.all(
    roles.map(async (r) => {
      const users = await prisma.user.findMany({
        where: { role: r },
        orderBy: { name: "asc" },
      });
      return { role: r, count: users.length, users };
    })
  );

  const grouped: any = {};
  groupData.forEach((g) => {
    grouped[g.role.toLowerCase()] = {
      count: g.count,
      users: g.users.map(sanitizeUser),
    };
  });

  return {
    all: {
      users: allUsers.map(sanitizeUser),
      total: totalUsers,
    },
    admin: grouped.admin,
    doctor: grouped.doctor,
    nurse: grouped.nurse,
    totalUsers,
    activeAccess,
    deniedAccess,
  };
};