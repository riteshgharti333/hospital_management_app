"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterMoneyReceiptsService = exports.searchMoneyReceipts = exports.deleteMoneyReceipt = exports.updateMoneyReceipt = exports.getMoneyReceiptsByDateRange = exports.getMoneyReceiptById = exports.getAllMoneyReceiptsService = exports.createMoneyReceipt = void 0;
const prisma_1 = require("../../lib/prisma");
const cacheVersion_1 = require("../../utils/cacheVersion");
const filterPaginate_1 = require("../../utils/filterPaginate");
const pagination_1 = require("../../utils/pagination");
const searchCache_1 = require("../../utils/searchCache");
const createMoneyReceipt = async (data) => {
    await (0, cacheVersion_1.bumpCacheVersion)("moneyreceipt");
    return prisma_1.prisma.moneyReceipt.create({ data });
};
exports.createMoneyReceipt = createMoneyReceipt;
const getAllMoneyReceiptsService = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, { model: "moneyReceipt" }, cursor);
};
exports.getAllMoneyReceiptsService = getAllMoneyReceiptsService;
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
    await (0, cacheVersion_1.bumpCacheVersion)("moneyreceipt");
    return prisma_1.prisma.moneyReceipt.update({
        where: { id },
        data,
    });
};
exports.updateMoneyReceipt = updateMoneyReceipt;
const deleteMoneyReceipt = async (id) => {
    await (0, cacheVersion_1.bumpCacheVersion)("moneyreceipt");
    return prisma_1.prisma.moneyReceipt.delete({ where: { id } });
};
exports.deleteMoneyReceipt = deleteMoneyReceipt;
exports.searchMoneyReceipts = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "moneyReceipt", // ✅ Fixed: was "MoneyReceipt"
    exactFields: ["admissionNo"],
    prefixFields: ["admissionNo", "patientName"],
    similarFields: ["patientName", "mobile"],
    // selectFields: [
    //   "id",
    //   "admissionNo",
    //   "patientName",
    //   "mobile",
    //   "amount",
    //   "paymentMode",
    //   "date",
    //   "status",
    //   "createdAt",
    // ],
});
const filterMoneyReceiptsService = async (params) => {
    const { fromDate, toDate, paymentMode, status, cursor, limit } = params;
    const where = {};
    // ✅ Payment Mode filter
    if (paymentMode) {
        where.paymentMode = {
            equals: paymentMode,
            mode: "insensitive",
        };
    }
    // ✅ Status filter
    if (status) {
        where.status = {
            equals: status,
            mode: "insensitive",
        };
    }
    // ✅ Date range filter (using 'date' field instead of 'createdAt')
    if (fromDate || toDate) {
        where.date = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "moneyReceipt", // ✅ "moneyReceipt"
        limit,
    }, cursor, where);
};
exports.filterMoneyReceiptsService = filterMoneyReceiptsService;
