"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBankLedgerEntry = exports.updateBankLedgerEntry = exports.getBankBalance = exports.getBankLedgerEntryById = exports.getAllBankLedgerEntries = exports.createBankLedgerEntry = void 0;
const prisma_1 = require("../../lib/prisma");
const createBankLedgerEntry = async (data) => {
    return prisma_1.prisma.bankLedger.create({ data });
};
exports.createBankLedgerEntry = createBankLedgerEntry;
const getAllBankLedgerEntries = async (filters) => {
    const where = {};
    if (filters.bankName) {
        where.bankName = filters.bankName;
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
    return prisma_1.prisma.bankLedger.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllBankLedgerEntries = getAllBankLedgerEntries;
const getBankLedgerEntryById = async (id) => {
    return prisma_1.prisma.bankLedger.findUnique({ where: { id } });
};
exports.getBankLedgerEntryById = getBankLedgerEntryById;
const getBankBalance = async (bankName) => {
    const entries = await prisma_1.prisma.bankLedger.findMany({
        where: { bankName },
        select: { amountType: true, amount: true },
    });
    return entries.reduce((balance, entry) => {
        const amount = entry.amount.toNumber();
        return entry.amountType === "Credit" ? balance + amount : balance - amount;
    }, 0);
};
exports.getBankBalance = getBankBalance;
const updateBankLedgerEntry = async (id, data) => {
    return prisma_1.prisma.bankLedger.update({
        where: { id },
        data,
    });
};
exports.updateBankLedgerEntry = updateBankLedgerEntry;
const deleteBankLedgerEntry = async (id) => {
    return prisma_1.prisma.bankLedger.delete({ where: { id } });
};
exports.deleteBankLedgerEntry = deleteBankLedgerEntry;
