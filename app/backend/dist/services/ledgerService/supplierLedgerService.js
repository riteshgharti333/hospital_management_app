"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSupplierLedgerEntry = exports.getSupplierSummary = exports.getSupplierOutstanding = exports.getSupplierLedgerEntryById = exports.getAllSupplierLedgerEntries = exports.updateSupplierLedgerEntry = exports.createSupplierLedgerEntry = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../lib/prisma");
const createSupplierLedgerEntry = async (data) => {
    return prisma_1.prisma.supplierLedger.create({
        data: {
            ...data,
            amount: new client_1.Prisma.Decimal(data.amount.toString()), // Convert to Decimal
            attachBill: data.attachBill ?? null // Handle undefined → null
        }
    });
};
exports.createSupplierLedgerEntry = createSupplierLedgerEntry;
// Update the update function similarly
const updateSupplierLedgerEntry = async (id, data) => {
    return prisma_1.prisma.supplierLedger.update({
        where: { id },
        data: {
            ...data,
            amount: data.amount !== undefined
                ? new client_1.Prisma.Decimal(data.amount.toString())
                : undefined,
            attachBill: data.attachBill ?? null
        }
    });
};
exports.updateSupplierLedgerEntry = updateSupplierLedgerEntry;
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
    return prisma_1.prisma.supplierLedger.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllSupplierLedgerEntries = getAllSupplierLedgerEntries;
const getSupplierLedgerEntryById = async (id) => {
    return prisma_1.prisma.supplierLedger.findUnique({ where: { id } });
};
exports.getSupplierLedgerEntryById = getSupplierLedgerEntryById;
const getSupplierOutstanding = async (supplierName) => {
    const entries = await prisma_1.prisma.supplierLedger.findMany({
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
    return prisma_1.prisma.supplierLedger.groupBy({
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
const deleteSupplierLedgerEntry = async (id) => {
    return prisma_1.prisma.supplierLedger.delete({ where: { id } });
};
exports.deleteSupplierLedgerEntry = deleteSupplierLedgerEntry;
