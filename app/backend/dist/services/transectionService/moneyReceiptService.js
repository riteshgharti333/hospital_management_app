"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentModeBreakdownAnalytics = exports.getRevenueAnalytics = exports.filterMoneyReceiptsService = exports.searchMoneyReceipts = exports.deleteMoneyReceipt = exports.updateMoneyReceipt = exports.getMoneyReceiptsByDateRange = exports.getMoneyReceiptById = exports.getAllMoneyReceiptsService = exports.createMoneyReceipt = void 0;
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
const format = (num) => Number(num.toFixed(2));
const getRevenueAnalytics = async () => {
    const now = new Date();
    const format = (num) => Number(num.toFixed(2));
    // ============================
    // DATE RANGES
    // ============================
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    // MONTH SPECIFIC RANGES
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    // ============================
    // HELPER
    // ============================
    const sumRevenue = async (from, to = now) => {
        const result = await prisma_1.prisma.moneyReceipt.aggregate({
            _sum: { amount: true },
            where: { date: { gte: from, lte: to } },
        });
        return format(result._sum.amount || 0);
    };
    // ============================
    // MAIN VALUES
    // ============================
    const threeMonths = await sumRevenue(threeMonthsAgo);
    const sixMonths = await sumRevenue(sixMonthsAgo);
    const oneYear = await sumRevenue(oneYearAgo);
    const totalAgg = await prisma_1.prisma.moneyReceipt.aggregate({
        _sum: { amount: true },
    });
    const total = format(totalAgg._sum.amount || 0);
    // ============================
    // CURRENT VS PREVIOUS MONTH
    // ============================
    const currentMonth = await sumRevenue(currentMonthStart);
    const previousMonth = await sumRevenue(previousMonthStart, previousMonthEnd);
    const percentChange = previousMonth
        ? format(((currentMonth - previousMonth) / previousMonth) * 100)
        : 0;
    return {
        threeMonths,
        sixMonths,
        oneYear,
        total,
        currentMonth,
        previousMonth,
        percentChange,
    };
};
exports.getRevenueAnalytics = getRevenueAnalytics;
const getPaymentModeBreakdownAnalytics = async () => {
    const paymentModes = [
        "Online Transfer",
        "Card",
        "Cash",
        "Cheque",
        "Other"
    ];
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    // Helpers
    const sumAmount = async (where) => {
        const result = await prisma_1.prisma.moneyReceipt.aggregate({
            _sum: { amount: true },
            where
        });
        return result._sum.amount || 0;
    };
    const buildStats = async (from) => {
        const where = from ? { date: { gte: from, lte: now } } : {};
        const totalAmount = await sumAmount(where);
        const amounts = await Promise.all(paymentModes.map((mode) => sumAmount({ ...where, paymentMode: mode })));
        const percentages = amounts.map((amt) => totalAmount === 0 ? 0 : Number(((amt / totalAmount) * 100).toFixed(2)));
        return {
            totalAmount: Number(totalAmount.toFixed(2)),
            paymentModes,
            amounts: amounts.map((a) => Number(a.toFixed(2))),
            percentages,
        };
    };
    return {
        allTime: await buildStats(),
        threeMonths: await buildStats(threeMonthsAgo),
        sixMonths: await buildStats(sixMonthsAgo),
        oneYear: await buildStats(oneYearAgo),
    };
};
exports.getPaymentModeBreakdownAnalytics = getPaymentModeBreakdownAnalytics;
