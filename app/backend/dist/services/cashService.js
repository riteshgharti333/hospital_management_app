"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCashAccountsService = exports.searchCashAccount = exports.deleteCashAccount = exports.updateCashAccount = exports.getCashAccountById = exports.getAllCashAccounts = exports.getCashAccountByCode = exports.getCashAccountByName = exports.createCashAccount = exports.generateCashCode = void 0;
const prisma_1 = require("../lib/prisma");
const pagination_1 = require("../utils/pagination");
const filterPaginate_1 = require("../utils/filterPaginate");
const searchCache_1 = require("../utils/searchCache");
const cacheVersion_1 = require("../utils/cacheVersion");
const generateCashCode = async () => {
    const lastCash = await prisma_1.prisma.cashAccount.findFirst({
        orderBy: { id: "desc" },
    });
    const nextNumber = lastCash ? lastCash.id + 1 : 1;
    return `CASH-${nextNumber}`;
};
exports.generateCashCode = generateCashCode;
const createCashAccount = async (data) => {
    const code = await (0, exports.generateCashCode)();
    const result = await prisma_1.prisma.cashAccount.create({
        data: {
            ...data,
            code,
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("cashaccount");
    return result;
};
exports.createCashAccount = createCashAccount;
const getCashAccountByName = async (cashName) => {
    return prisma_1.prisma.cashAccount.findFirst({
        where: {
            cashName: {
                equals: cashName,
                mode: "insensitive"
            }
        },
    });
};
exports.getCashAccountByName = getCashAccountByName;
const getCashAccountByCode = async (code) => {
    return prisma_1.prisma.cashAccount.findUnique({ where: { code } });
};
exports.getCashAccountByCode = getCashAccountByCode;
const getAllCashAccounts = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, { model: "cashAccount" }, cursor);
};
exports.getAllCashAccounts = getAllCashAccounts;
const getCashAccountById = async (id) => {
    return prisma_1.prisma.cashAccount.findUnique({ where: { id } });
};
exports.getCashAccountById = getCashAccountById;
const updateCashAccount = async (id, data) => {
    const result = await prisma_1.prisma.cashAccount.update({
        where: { id },
        data,
    });
    await (0, cacheVersion_1.bumpCacheVersion)("cashaccount");
    return result;
};
exports.updateCashAccount = updateCashAccount;
const deleteCashAccount = async (id) => {
    const result = await prisma_1.prisma.cashAccount.delete({
        where: { id },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("cashaccount");
    return result;
};
exports.deleteCashAccount = deleteCashAccount;
exports.searchCashAccount = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "CashAccount",
    exactFields: ["cashName", "code"],
    prefixFields: ["cashName", "code"],
    similarFields: ["cashName"],
    selectFields: [
        "id",
        "code",
        "cashName",
        "isActive",
        "createdAt",
        "updatedAt",
    ],
});
const filterCashAccountsService = async (params) => {
    const { fromDate, toDate, isActive, cursor, limit } = params;
    const where = {};
    // Active status filter
    if (isActive !== undefined) {
        where.isActive = isActive;
    }
    // Date range filter
    if (fromDate || toDate) {
        where.createdAt = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "cashAccount",
        limit,
    }, cursor, where);
};
exports.filterCashAccountsService = filterCashAccountsService;
