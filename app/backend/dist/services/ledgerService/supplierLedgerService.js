"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplierLedgerEntry = exports.updateSupplierLedgerEntry = exports.getSupplierSummary = exports.getSupplierOutstanding = exports.getSupplierLedgerEntryById = exports.getAllSupplierLedgerEntries = exports.createSupplierLedgerEntry = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSupplierLedgerEntry = async (data) => {
    return prisma.supplierLedger.create({ data });
};
exports.createSupplierLedgerEntry = createSupplierLedgerEntry;
const getAllSupplierLedgerEntries = async (filters) => {
    const where = {};
    if (filters.supplierName) {
        where.supplierName = filters.supplierName;
    }
    if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate)
            where.date.gte = filters.startDate;
        if (filters.endDate)
            where.date.lte = filters.endDate;
    }
    if (filters.invoiceNo) {
        where.invoiceNo = filters.invoiceNo;
    }
    if (filters.amountType) {
        where.amountType = filters.amountType;
    }
    return prisma.supplierLedger.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllSupplierLedgerEntries = getAllSupplierLedgerEntries;
const getSupplierLedgerEntryById = async (id) => {
    return prisma.supplierLedger.findUnique({ where: { id } });
};
exports.getSupplierLedgerEntryById = getSupplierLedgerEntryById;
const getSupplierOutstanding = async (supplierName) => {
    const entries = await prisma.supplierLedger.findMany({
        where: { supplierName },
        select: { amountType: true, amount: true },
    });
    return entries.reduce((balance, entry) => {
        const amount = entry.amount.toNumber();
        return entry.amountType === "Credit" ? balance + amount : balance - amount;
    }, 0);
};
exports.getSupplierOutstanding = getSupplierOutstanding;
const getSupplierSummary = async () => {
    return prisma.supplierLedger.groupBy({
        by: ["supplierName"],
        _sum: {
            amount: true,
        },
        orderBy: {
            _sum: {
                amount: "desc",
            },
        },
    });
};
exports.getSupplierSummary = getSupplierSummary;
const updateSupplierLedgerEntry = async (id, data) => {
    return prisma.supplierLedger.update({
        where: { id },
        data,
    });
};
exports.updateSupplierLedgerEntry = updateSupplierLedgerEntry;
const deleteSupplierLedgerEntry = async (id) => {
    return prisma.supplierLedger.delete({ where: { id } });
};
exports.deleteSupplierLedgerEntry = deleteSupplierLedgerEntry;
