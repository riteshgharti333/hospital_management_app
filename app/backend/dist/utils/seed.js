"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
async function createAdmin(regId, name, email, password) {
    if (!regId || !name || !email || !password) {
        console.error("❌ Missing admin fields. Check .env");
        return;
    }
    const existing = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (existing) {
        console.log(`✔ Admin already exists: ${email}`);
        return;
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 12);
    await prisma_1.prisma.user.create({
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
    await createAdmin(process.env.ADMIN1_REG_ID, process.env.ADMIN1_NAME, process.env.ADMIN1_EMAIL, password);
    await createAdmin(process.env.ADMIN2_REG_ID, process.env.ADMIN2_NAME, process.env.ADMIN2_EMAIL, password);
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
