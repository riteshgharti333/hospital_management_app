"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPatientLedgerService = exports.searchPatientLedger = exports.deleteLedgerEntry = exports.updateLedgerEntry = exports.getPatientBalance = exports.getLedgerEntryById = exports.getAllPatientLedgerService = exports.createLedgerEntry = void 0;
const prisma_1 = require("../../lib/prisma");
const applyCommonFields_1 = require("../../utils/applyCommonFields");
const filterPaginate_1 = require("../../utils/filterPaginate");
const pagination_1 = require("../../utils/pagination");
const searchCache_1 = require("../../utils/searchCache");
const createLedgerEntry = async (data) => {
    return prisma_1.prisma.patientLedger.create({ data });
};
exports.createLedgerEntry = createLedgerEntry;
const getAllPatientLedgerService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "patientLedger",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllPatientLedgerService = getAllPatientLedgerService;
const getLedgerEntryById = async (id) => {
    return prisma_1.prisma.patientLedger.findUnique({ where: { id } });
};
exports.getLedgerEntryById = getLedgerEntryById;
const getPatientBalance = async (patientName) => {
    const entries = await prisma_1.prisma.patientLedger.findMany({
        where: { patientName },
        select: { amountType: true, amount: true },
    });
    return entries.reduce((balance, entry) => {
        const amount = entry.amount.toNumber();
        return entry.amountType === "CREDIT"
            ? balance + amount
            : balance - amount;
    }, 0);
};
exports.getPatientBalance = getPatientBalance;
const updateLedgerEntry = async (id, data) => {
    return prisma_1.prisma.patientLedger.update({
        where: { id },
        data,
    });
};
exports.updateLedgerEntry = updateLedgerEntry;
const deleteLedgerEntry = async (id) => {
    return prisma_1.prisma.patientLedger.delete({ where: { id } });
};
exports.deleteLedgerEntry = deleteLedgerEntry;
const commonSearchFields = ["patientName"];
exports.searchPatientLedger = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "PatientLedger",
    cacheKeyPrefix: "patient-ledger",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterPatientLedgerService = async (filters) => {
    const { amountType, paymentMode, fromDate, toDate, cursor, limit } = filters;
    const filterObj = {};
    if (amountType)
        filterObj.amountType = amountType;
    if (paymentMode)
        filterObj.paymentMode = paymentMode;
    if (fromDate || toDate) {
        filterObj.transactionDate = {
            gte: fromDate,
            lte: toDate,
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "patientLedger",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterPatientLedgerService = filterPatientLedgerService;
