"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBankAccountsService = exports.searchBankAccount = exports.deleteBankAccount = exports.updateBankAccount = exports.getBankAccountById = exports.getAllBankAccounts = exports.getBankAccountByCode = exports.getBankAccountByAccountNo = exports.createBankAccount = exports.generateBankCode = void 0;
const prisma_1 = require("../lib/prisma");
const pagination_1 = require("../utils/pagination");
const filterPaginate_1 = require("../utils/filterPaginate");
const searchCache_1 = require("../utils/searchCache");
const cacheVersion_1 = require("../utils/cacheVersion");
const generateBankCode = async () => {
    const lastBank = await prisma_1.prisma.bankAccount.findFirst({
        orderBy: { id: "desc" },
    });
    const nextNumber = lastBank ? lastBank.id + 1 : 1;
    return `BANK-${nextNumber}`;
};
exports.generateBankCode = generateBankCode;
const createBankAccount = async (data) => {
    const code = await (0, exports.generateBankCode)();
    const result = await prisma_1.prisma.bankAccount.create({
        data: {
            ...data,
            code,
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("bankaccount");
    return result;
};
exports.createBankAccount = createBankAccount;
const getBankAccountByAccountNo = async (accountNo) => {
    return prisma_1.prisma.bankAccount.findFirst({
        where: { accountNo },
    });
};
exports.getBankAccountByAccountNo = getBankAccountByAccountNo;
const getBankAccountByCode = async (code) => {
    return prisma_1.prisma.bankAccount.findUnique({ where: { code } });
};
exports.getBankAccountByCode = getBankAccountByCode;
const getAllBankAccounts = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, { model: "bankAccount" }, cursor);
};
exports.getAllBankAccounts = getAllBankAccounts;
const getBankAccountById = async (id) => {
    return prisma_1.prisma.bankAccount.findUnique({ where: { id } });
};
exports.getBankAccountById = getBankAccountById;
const updateBankAccount = async (id, data) => {
    const result = await prisma_1.prisma.bankAccount.update({
        where: { id },
        data,
    });
    await (0, cacheVersion_1.bumpCacheVersion)("bankaccount");
    return result;
};
exports.updateBankAccount = updateBankAccount;
const deleteBankAccount = async (id) => {
    const result = await prisma_1.prisma.bankAccount.delete({
        where: { id },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("bankaccount");
    return result;
};
exports.deleteBankAccount = deleteBankAccount;
exports.searchBankAccount = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "BankAccount",
    exactFields: ["bankName", "accountNo", "code"],
    prefixFields: ["bankName", "accountNo"],
    similarFields: ["bankName"],
    selectFields: [
        "id",
        "code",
        "bankName",
        "accountNo",
        "ifscCode",
        "isActive",
        "createdAt",
        "updatedAt",
    ],
});
const filterBankAccountsService = async (params) => {
    const { fromDate, toDate, isActive, cursor, limit } = params;
    const where = {};
    // ✅ Active status filter
    if (isActive !== undefined) {
        where.isActive = isActive;
    }
    // ✅ Date range filter
    if (fromDate || toDate) {
        where.createdAt = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "bankAccount",
        limit,
        select: {
            id: true,
            code: true,
            bankName: true,
            accountNo: true,
            ifscCode: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    }, cursor, where);
};
exports.filterBankAccountsService = filterBankAccountsService;
