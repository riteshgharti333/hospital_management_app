import app from "./app";
import { prisma } from "./lib/prisma";
import { checkDB } from "./utils/checkPrismaConnection";

checkDB();

const PORT = process.env.PORT || 5000;
console.log(process.env.DATABASE_URL)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Disconnecting Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Disconnecting Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('exit', async () => {
  console.log('Exiting. Disconnecting Prisma...');
  await prisma.$disconnect();
});