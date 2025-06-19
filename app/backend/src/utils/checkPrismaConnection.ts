
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log(process.env.DATABASE_URL)

export const checkDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma");
  } catch (err) {
    console.error("❌ Prisma connection failed:", err);
    process.exit(1);
  }
}; 
