"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterMoneyReceiptsService = exports.searchMoneyReceipts = exports.deleteMoneyReceipt = exports.updateMoneyReceipt = exports.getMoneyReceiptsByDateRange = exports.getMoneyReceiptById = exports.getAllMoneyReceiptsService = exports.createMoneyReceipt = void 0;
const prisma_1 = require("../../lib/prisma");
const applyCommonFields_1 = require("../../utils/applyCommonFields");
const filterPaginate_1 = require("../../utils/filterPaginate");
const pagination_1 = require("../../utils/pagination");
const searchCache_1 = require("../../utils/searchCache");
const createMoneyReceipt = async (data) => {
    return prisma_1.prisma.moneyReceipt.create({ data });
};
exports.createMoneyReceipt = createMoneyReceipt;
const getAllMoneyReceiptsService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "moneyReceipt",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
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
const moneyReceiptSearchFields = ["patientName", "mobile", "admissionNo"];
exports.searchMoneyReceipts = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "MoneyReceipt",
    cacheKeyPrefix: "moneyreceipt",
    ...(0, applyCommonFields_1.applyCommonFields)(moneyReceiptSearchFields),
});
const filterMoneyReceiptsService = async (filters) => {
    const { fromDate, toDate, paymentMode, status, cursor, limit } = filters;
    const filterObj = {};
    if (paymentMode)
        filterObj.paymentMode = paymentMode;
    if (status)
        filterObj.status = status;
    if (fromDate || toDate) {
        filterObj.date = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "moneyReceipt",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterMoneyReceiptsService = filterMoneyReceiptsService;
