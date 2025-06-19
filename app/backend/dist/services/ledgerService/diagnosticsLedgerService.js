"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiagnosticsEntry = exports.updateDiagnosticsEntry = exports.getPatientDiagnosticsTotal = exports.getDiagnosticsEntryById = exports.getAllDiagnosticsEntries = exports.createDiagnosticsEntry = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createDiagnosticsEntry = async (data) => {
    return prisma.diagnosticsLedger.create({ data });
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
    return prisma.diagnosticsLedger.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllDiagnosticsEntries = getAllDiagnosticsEntries;
const getDiagnosticsEntryById = async (id) => {
    return prisma.diagnosticsLedger.findUnique({ where: { id } });
};
exports.getDiagnosticsEntryById = getDiagnosticsEntryById;
const getPatientDiagnosticsTotal = async (patientName) => {
    const entries = await prisma.diagnosticsLedger.findMany({
        where: { patientName },
        select: { amount: true },
    });
    return entries.reduce((total, entry) => total + entry.amount.toNumber(), 0);
};
exports.getPatientDiagnosticsTotal = getPatientDiagnosticsTotal;
const updateDiagnosticsEntry = async (id, data) => {
    return prisma.diagnosticsLedger.update({
        where: { id },
        data,
    });
};
exports.updateDiagnosticsEntry = updateDiagnosticsEntry;
const deleteDiagnosticsEntry = async (id) => {
    return prisma.diagnosticsLedger.delete({ where: { id } });
};
exports.deleteDiagnosticsEntry = deleteDiagnosticsEntry;
