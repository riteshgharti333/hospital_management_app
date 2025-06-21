import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prismaClient =
  globalForPrisma.prisma ??
  new (PrismaClient as any)({
    log: ["error", "warn"],
    __internal: {
      engine: {
        enablePreparedStatements: false,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

export const prisma = prismaClient;
