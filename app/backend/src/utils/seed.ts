import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

async function createAdmin(
  regId: string,
  name: string,
  email: string,
  password: string
) {
  if (!regId || !name || !email || !password) {
    console.error("❌ Missing admin fields. Check .env");
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(`✔ Admin already exists: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      regId,
      name,
      email,
      role: "ADMIN",
      password: hashedPassword,
      mustChangePassword: false,
      isActive: true,
    },
  });

  console.log(`🎉 Admin created: ${email}`);
}

async function main() {
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  await createAdmin(
    process.env.ADMIN1_REG_ID!,
    process.env.ADMIN1_NAME!,
    process.env.ADMIN1_EMAIL!,
    password!
  );

  await createAdmin(
    process.env.ADMIN2_REG_ID!,
    process.env.ADMIN2_NAME!,
    process.env.ADMIN2_EMAIL!,
    password!
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
