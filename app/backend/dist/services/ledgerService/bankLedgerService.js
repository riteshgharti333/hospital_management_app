"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBankLedgerService = exports.searchBankLedger = exports.deleteBankLedgerEntry = exports.updateBankLedgerEntry = exports.getBankBalance = exports.getBankLedgerEntryById = exports.getAllBankLedgerService = exports.createBankLedgerEntry = void 0;
const prisma_1 = require("../../lib/prisma");
const applyCommonFields_1 = require("../../utils/applyCommonFields");
const filterPaginate_1 = require("../../utils/filterPaginate");
const pagination_1 = require("../../utils/pagination");
const searchCache_1 = require("../../utils/searchCache");
const createBankLedgerEntry = async (data) => {
    return prisma_1.prisma.bankLedger.create({ data });
};
exports.createBankLedgerEntry = createBankLedgerEntry;
const getAllBankLedgerService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "bankLedger",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllBankLedgerService = getAllBankLedgerService;
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
const commonSearchFields = ["bankName"];
exports.searchBankLedger = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "BankLedger",
    cacheKeyPrefix: "bank-ledger",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterBankLedgerService = async (filters) => {
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
        model: "bankLedger",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterBankLedgerService = filterBankLedgerService;
