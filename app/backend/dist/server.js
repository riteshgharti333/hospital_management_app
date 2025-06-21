"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const prisma_1 = require("./lib/prisma");
const checkPrismaConnection_1 = require("./utils/checkPrismaConnection");
(0, checkPrismaConnection_1.checkDB)();
const PORT = process.env.PORT || 5000;
console.log(process.env.DATABASE_URL);
app_1.default.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received. Disconnecting Prisma...');
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Disconnecting Prisma...');
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
process.on('exit', async () => {
    console.log('Exiting. Disconnecting Prisma...');
    await prisma_1.prisma.$disconnect();
});
