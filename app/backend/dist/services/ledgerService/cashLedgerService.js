"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCashLedgerService = exports.searchCashLedger = exports.deleteCashLedgerEntry = exports.updateCashLedgerEntry = exports.getCashBalance = exports.getCashLedgerEntryById = exports.getAllCashLedgerService = exports.createCashLedgerEntry = void 0;
const prisma_1 = require("../../lib/prisma");
const applyCommonFields_1 = require("../../utils/applyCommonFields");
const filterPaginate_1 = require("../../utils/filterPaginate");
const pagination_1 = require("../../utils/pagination");
const searchCache_1 = require("../../utils/searchCache");
const createCashLedgerEntry = async (data) => {
    return prisma_1.prisma.cashLedger.create({ data });
};
exports.createCashLedgerEntry = createCashLedgerEntry;
const getAllCashLedgerService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "cashLedger",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllCashLedgerService = getAllCashLedgerService;
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
const commonSearchFields = ["purpose"];
exports.searchCashLedger = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "CashLedger",
    cacheKeyPrefix: "cash-ledger",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterCashLedgerService = async (filters) => {
    const { amountType, fromDate, toDate, cursor, limit } = filters;
    const filterObj = {};
    if (amountType)
        filterObj.amountType = { equals: amountType, mode: "insensitive" };
    if (fromDate || toDate) {
        filterObj.date = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "cashLedger",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterCashLedgerService = filterCashLedgerService;
