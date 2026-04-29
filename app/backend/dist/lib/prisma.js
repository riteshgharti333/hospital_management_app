"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const isRender = process.env.RENDER === "true";
exports.prisma = new client_1.PrismaClient(isRender
    ? {
        __internal: {
            engine: {
                enablePreparedStatements: false,
            },
        },
    }
    : {});
