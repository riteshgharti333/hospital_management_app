"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLedgerEntry = exports.updateLedgerEntry = exports.getPatientBalance = exports.getLedgerEntryById = exports.getAllLedgerEntries = exports.createLedgerEntry = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLedgerEntry = async (data) => {
    return prisma.patientLedger.create({ data });
};
exports.createLedgerEntry = createLedgerEntry;
const getAllLedgerEntries = async (filters) => {
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
    if (filters.amountType) {
        where.amountType = filters.amountType;
    }
    return prisma.patientLedger.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllLedgerEntries = getAllLedgerEntries;
const getLedgerEntryById = async (id) => {
    return prisma.patientLedger.findUnique({ where: { id } });
};
exports.getLedgerEntryById = getLedgerEntryById;
const getPatientBalance = async (patientName) => {
    const entries = await prisma.patientLedger.findMany({
        where: { patientName },
        select: { amountType: true, amount: true },
    });
    return entries.reduce((balance, entry) => {
        const amount = entry.amount.toNumber();
        return entry.amountType === "Credit" ? balance + amount : balance - amount;
    }, 0);
};
exports.getPatientBalance = getPatientBalance;
const updateLedgerEntry = async (id, data) => {
    return prisma.patientLedger.update({
        where: { id },
        data,
    });
};
exports.updateLedgerEntry = updateLedgerEntry;
const deleteLedgerEntry = async (id) => {
    return prisma.patientLedger.delete({ where: { id } });
};
exports.deleteLedgerEntry = deleteLedgerEntry;
