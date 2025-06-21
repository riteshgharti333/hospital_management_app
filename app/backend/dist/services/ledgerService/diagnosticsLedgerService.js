"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiagnosticsEntry = exports.updateDiagnosticsEntry = exports.getPatientDiagnosticsTotal = exports.getDiagnosticsEntryById = exports.getAllDiagnosticsEntries = exports.createDiagnosticsEntry = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
const createDiagnosticsEntry = async (data) => {
    return prisma_1.prisma.diagnosticsLedger.create({
        data: {
            ...data,
            amount: new client_1.Prisma.Decimal(data.amount.toString()), // Force Decimal conversion
            attachReport: data.attachReport ?? null, // Convert undefined → null
        },
    });
};
exports.createDiagnosticsEntry = createDiagnosticsEntry;
const getAllDiagnosticsEntries = async (filters) => {
    const where = {};
    if (filters.patientName) {
        where.patientName = filters.patientName;
    }
    if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate)
            where.date.gte = filters.startDate;
        if (filters.endDate)
            where.date.lte = filters.endDate;
    }
    if (filters.testName) {
        where.testName = filters.testName;
    }
    return prisma_1.prisma.diagnosticsLedger.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllDiagnosticsEntries = getAllDiagnosticsEntries;
const getDiagnosticsEntryById = async (id) => {
    return prisma_1.prisma.diagnosticsLedger.findUnique({ where: { id } });
};
exports.getDiagnosticsEntryById = getDiagnosticsEntryById;
const getPatientDiagnosticsTotal = async (patientName) => {
    const entries = await prisma_1.prisma.diagnosticsLedger.findMany({
        where: { patientName },
        select: { amount: true },
    });
    return entries.reduce((total, entry) => total + entry.amount.toNumber(), 0);
};
exports.getPatientDiagnosticsTotal = getPatientDiagnosticsTotal;
const updateDiagnosticsEntry = async (id, data) => {
    return prisma_1.prisma.diagnosticsLedger.update({
        where: { id },
        data: {
            ...data,
            amount: data.amount !== undefined
                ? new client_1.Prisma.Decimal(data.amount.toString())
                : undefined,
            attachReport: data.attachReport ?? null // Convert undefined to null
        },
    });
};
exports.updateDiagnosticsEntry = updateDiagnosticsEntry;
const deleteDiagnosticsEntry = async (id) => {
    return prisma_1.prisma.diagnosticsLedger.delete({ where: { id } });
};
exports.deleteDiagnosticsEntry = deleteDiagnosticsEntry;
