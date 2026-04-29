"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHospitalId = void 0;
const prisma_1 = require("../lib/prisma");
const generateHospitalId = async ({ prefix, model, field, }) => {
    const year = new Date().getFullYear();
    const lastRecord = await prisma_1.prisma[model].findFirst({
        where: {
            [field]: {
                startsWith: `${prefix}-${year}`,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            [field]: true,
        },
    });
    let nextNumber = 1;
    if (lastRecord?.[field]) {
        const lastSeq = Number(lastRecord[field].split("-")[2]);
        nextNumber = lastSeq + 1;
    }
    const paddedSeq = String(nextNumber).padStart(6, "0");
    return `${prefix}-${year}-${paddedSeq}`;
};
exports.generateHospitalId = generateHospitalId;
