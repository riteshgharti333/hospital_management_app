import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// ✅ Create a single PrismaClient instance
const prismaClient = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'], // log errors and warnings only
});

// ✅ In development, store it on the global object to prevent re-instantiations
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

// ✅ Export the instance for use across the app
export const prisma = prismaClient;
