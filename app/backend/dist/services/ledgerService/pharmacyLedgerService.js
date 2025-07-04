"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePharmacyLedgerEntry = exports.updatePharmacyLedgerEntry = exports.getCategoryWiseSummary = exports.getPharmacySummary = exports.getPharmacyLedgerEntryById = exports.getAllPharmacyLedgerEntries = exports.createPharmacyLedgerEntry = void 0;
const prisma_1 = require("../../lib/prisma");
const createPharmacyLedgerEntry = async (data) => {
    return prisma_1.prisma.pharmacyLedger.create({ data });
};
exports.createPharmacyLedgerEntry = createPharmacyLedgerEntry;
const getAllPharmacyLedgerEntries = async (filters) => {
    const where = {};
    if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate)
            where.date.gte = filters.startDate;
        if (filters.endDate)
            where.date.lte = filters.endDate;
    }
    if (filters.medicineName) {
        where.medicineName = filters.medicineName;
    }
    if (filters.category) {
        where.category = filters.category;
    }
    if (filters.amountType) {
        where.amountType = filters.amountType;
    }
    return prisma_1.prisma.pharmacyLedger.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllPharmacyLedgerEntries = getAllPharmacyLedgerEntries;
const getPharmacyLedgerEntryById = async (id) => {
    return prisma_1.prisma.pharmacyLedger.findUnique({ where: { id } });
};
exports.getPharmacyLedgerEntryById = getPharmacyLedgerEntryById;
const getPharmacySummary = async () => {
    const income = await prisma_1.prisma.pharmacyLedger.aggregate({
        _sum: { amount: true },
        where: { amountType: "Income" },
    });
    const expense = await prisma_1.prisma.pharmacyLedger.aggregate({
        _sum: { amount: true },
        where: { amountType: "Expense" },
    });
    return {
        totalIncome: income._sum.amount?.toNumber() || 0,
        totalExpense: expense._sum.amount?.toNumber() || 0,
        netProfit: (income._sum.amount?.toNumber() || 0) -
            (expense._sum.amount?.toNumber() || 0),
    };
};
exports.getPharmacySummary = getPharmacySummary;
const getCategoryWiseSummary = async () => {
    return prisma_1.prisma.pharmacyLedger.groupBy({
        by: ["category", "amountType"],
        _sum: { amount: true },
        orderBy: { category: "asc" },
    });
};
exports.getCategoryWiseSummary = getCategoryWiseSummary;
const updatePharmacyLedgerEntry = async (id, data) => {
    return prisma_1.prisma.pharmacyLedger.update({
        where: { id },
        data,
    });
};
exports.updatePharmacyLedgerEntry = updatePharmacyLedgerEntry;
const deletePharmacyLedgerEntry = async (id) => {
    return prisma_1.prisma.pharmacyLedger.delete({ where: { id } });
};
exports.deletePharmacyLedgerEntry = deletePharmacyLedgerEntry;
