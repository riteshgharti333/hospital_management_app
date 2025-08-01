"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMoneyReceipt = exports.updateMoneyReceipt = exports.getMoneyReceiptsByDateRange = exports.getMoneyReceiptById = exports.getAllMoneyReceipts = exports.createMoneyReceipt = void 0;
const prisma_1 = require("../../lib/prisma");
const createMoneyReceipt = async (data) => {
    return prisma_1.prisma.moneyReceipt.create({ data });
};
exports.createMoneyReceipt = createMoneyReceipt;
const getAllMoneyReceipts = async (filters) => {
    const where = {};
    if (filters?.mobile) {
        where.mobile = { contains: filters.mobile };
    }
    if (filters?.patientName) {
        where.patientName = {
            contains: filters.patientName,
            mode: "insensitive",
        };
    }
    if (filters?.amount) {
        where.amount = filters.amount;
    }
    if (filters?.paymentMode) {
        where.paymentMode = filters.paymentMode;
    }
    return prisma_1.prisma.moneyReceipt.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllMoneyReceipts = getAllMoneyReceipts;
const getMoneyReceiptById = async (id) => {
    return prisma_1.prisma.moneyReceipt.findUnique({ where: { id } });
};
exports.getMoneyReceiptById = getMoneyReceiptById;
const getMoneyReceiptsByDateRange = async (startDate, endDate) => {
    return prisma_1.prisma.moneyReceipt.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { date: "desc" },
    });
};
exports.getMoneyReceiptsByDateRange = getMoneyReceiptsByDateRange;
const updateMoneyReceipt = async (id, data) => {
    return prisma_1.prisma.moneyReceipt.update({
        where: { id },
        data,
    });
};
exports.updateMoneyReceipt = updateMoneyReceipt;
const deleteMoneyReceipt = async (id) => {
    return prisma_1.prisma.moneyReceipt.delete({ where: { id } });
};
exports.deleteMoneyReceipt = deleteMoneyReceipt;
