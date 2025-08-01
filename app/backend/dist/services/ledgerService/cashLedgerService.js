"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCashLedgerEntry = exports.updateCashLedgerEntry = exports.getCashBalance = exports.getCashLedgerEntryById = exports.getAllCashLedgerEntries = exports.createCashLedgerEntry = void 0;
const prisma_1 = require("../../lib/prisma");
const createCashLedgerEntry = async (data) => {
    return prisma_1.prisma.cashLedger.create({ data });
};
exports.createCashLedgerEntry = createCashLedgerEntry;
const getAllCashLedgerEntries = async (filters) => {
    const where = {};
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
    return prisma_1.prisma.cashLedger.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllCashLedgerEntries = getAllCashLedgerEntries;
const getCashLedgerEntryById = async (id) => {
    return prisma_1.prisma.cashLedger.findUnique({ where: { id } });
};
exports.getCashLedgerEntryById = getCashLedgerEntryById;
const getCashBalance = async () => {
    const entries = await prisma_1.prisma.cashLedger.findMany({
        select: { amountType: true, amount: true },
    });
    return entries.reduce((balance, entry) => {
        const amount = entry.amount.toNumber(); // convert Decimal to number
        return entry.amountType === "Credit" ? balance + amount : balance - amount;
    }, 0);
};
exports.getCashBalance = getCashBalance;
const updateCashLedgerEntry = async (id, data) => {
    return prisma_1.prisma.cashLedger.update({
        where: { id },
        data,
    });
};
exports.updateCashLedgerEntry = updateCashLedgerEntry;
const deleteCashLedgerEntry = async (id) => {
    return prisma_1.prisma.cashLedger.delete({ where: { id } });
};
exports.deleteCashLedgerEntry = deleteCashLedgerEntry;
