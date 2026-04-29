"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDB = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkDB = async () => {
    try {
        await prisma.$connect();
        console.log("✅ PostgreSQL connected via Prisma");
    }
    catch (err) {
        console.error("❌ Prisma connection failed:", err);
        process.exit(1);
    }
};
exports.checkDB = checkDB;
