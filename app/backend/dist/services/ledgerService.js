"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterLedgersService = exports.searchLedger = exports.deleteLedger = exports.updateLedger = exports.getCurrentBalance = exports.getLedgersByEntity = exports.getLedgerById = exports.getAllLedgers = exports.getLedgerByCode = exports.createLedger = exports.calculateBalance = exports.generateLedgerCode = void 0;
const prisma_1 = require("../lib/prisma");
const pagination_1 = require("../utils/pagination");
const filterPaginate_1 = require("../utils/filterPaginate");
const searchCache_1 = require("../utils/searchCache");
const cacheVersion_1 = require("../utils/cacheVersion");
const generateLedgerCode = async () => {
    const lastLedger = await prisma_1.prisma.ledger.findFirst({
        orderBy: { id: "desc" },
    });
    const nextNumber = lastLedger ? lastLedger.id + 1 : 1;
    return `HMS-LED-${nextNumber}`;
};
exports.generateLedgerCode = generateLedgerCode;
const calculateBalance = async (entityType, entityId, amountType, amount) => {
    const lastTransaction = await prisma_1.prisma.ledger.findFirst({
        where: {
            entityType,
            entityId,
        },
        orderBy: {
            transactionDate: "desc",
        },
    });
    const currentBalance = lastTransaction?.balance || 0;
    if (amountType === "CREDIT") {
        return Number(currentBalance) + amount;
    }
    else {
        return Number(currentBalance) - amount;
    }
};
exports.calculateBalance = calculateBalance;
const createLedger = async (data) => {
    const code = await (0, exports.generateLedgerCode)();
    const balance = await (0, exports.calculateBalance)(data.entityType, data.entityId, data.amountType, data.amount);
    const result = await prisma_1.prisma.ledger.create({
        data: {
            ...data,
            code,
            balance,
        },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("ledger");
    return result;
};
exports.createLedger = createLedger;
const getLedgerByCode = async (code) => {
    return prisma_1.prisma.ledger.findUnique({ where: { code } });
};
exports.getLedgerByCode = getLedgerByCode;
const getAllLedgers = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, { model: "ledger" }, cursor);
};
exports.getAllLedgers = getAllLedgers;
const getLedgerById = async (id) => {
    return prisma_1.prisma.ledger.findUnique({ where: { id } });
};
exports.getLedgerById = getLedgerById;
const getLedgersByEntity = async (entityType) => {
    return prisma_1.prisma.ledger.findMany({
        where: {
            entityType,
        },
        orderBy: {
            transactionDate: "desc",
        },
    });
};
exports.getLedgersByEntity = getLedgersByEntity;
const getCurrentBalance = async (entityType, entityId) => {
    const lastTransaction = await prisma_1.prisma.ledger.findFirst({
        where: {
            entityType,
            entityId,
        },
        orderBy: {
            transactionDate: "desc",
        },
        select: {
            balance: true,
        },
    });
    return lastTransaction?.balance || 0;
};
exports.getCurrentBalance = getCurrentBalance;
const updateLedger = async (id, data) => {
    // Note: Updating ledger transactions might affect subsequent balances
    // This is a simple update - you may need to recalculate subsequent balances
    const result = await prisma_1.prisma.ledger.update({
        where: { id },
        data,
    });
    await (0, cacheVersion_1.bumpCacheVersion)("ledger");
    return result;
};
exports.updateLedger = updateLedger;
const deleteLedger = async (id) => {
    const result = await prisma_1.prisma.ledger.delete({
        where: { id },
    });
    await (0, cacheVersion_1.bumpCacheVersion)("ledger");
    return result;
};
exports.deleteLedger = deleteLedger;
exports.searchLedger = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Ledger",
    exactFields: ["code", "entityId"], // Only search by code and entityId
    prefixFields: [], // Remove prefix fields
    similarFields: [], // Remove similar fields
    selectFields: [
        "id",
        "code",
        "entityType",
        "entityId",
        "transactionDate",
        "description",
        "amountType",
        "amount",
        "balance",
        "paymentMode",
        "referenceType",
        "referenceId",
        "remarks",
        "createdAt",
        "updatedAt",
    ],
});
const filterLedgersService = async (params, forcedEntityType) => {
    const { fromDate, toDate, entityType: paramEntityType, amountType, paymentMode, cursor, limit, } = params;
    const where = {};
    // Entity filter - prioritize forcedEntityType from path over query param
    const effectiveEntityType = forcedEntityType || paramEntityType;
    if (effectiveEntityType) {
        where.entityType = effectiveEntityType;
    }
    // Amount type filter
    if (amountType) {
        where.amountType = amountType;
    }
    // Payment mode filter
    if (paymentMode) {
        where.paymentMode = paymentMode;
    }
    // Date range filter
    if (fromDate || toDate) {
        where.transactionDate = {};
        if (fromDate) {
            // Set to start of day (00:00:00)
            const startDate = new Date(fromDate);
            startDate.setHours(0, 0, 0, 0);
            where.transactionDate.gte = startDate;
        }
        if (toDate) {
            // Set to end of day (23:59:59)
            const endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);
            where.transactionDate.lte = endDate;
        }
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "ledger",
        limit,
        select: {
            id: true,
            code: true,
            entityType: true,
            entityId: true,
            transactionDate: true,
            description: true,
            amountType: true,
            amount: true,
            balance: true,
            paymentMode: true,
            referenceType: true,
            referenceId: true,
            remarks: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            transactionDate: 'desc',
        },
    }, cursor, where);
};
exports.filterLedgersService = filterLedgersService;
