
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma");
  } catch (err) {
    console.error("❌ Prisma connection failed:", err);
    process.exit(1);
  }
};
