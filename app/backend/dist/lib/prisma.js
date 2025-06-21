"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
// ✅ Create a single PrismaClient instance
const prismaClient = globalForPrisma.prisma ?? new client_1.PrismaClient({
    log: ['error', 'warn'], // log errors and warnings only
});
// ✅ In development, store it on the global object to prevent re-instantiations
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClient;
}
// ✅ Export the instance for use across the app
exports.prisma = prismaClient;
