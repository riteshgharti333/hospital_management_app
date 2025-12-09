"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLedgerFlowSummary = exports.filterPatientLedgerService = exports.searchPatientLedger = exports.deleteLedgerEntry = exports.updateLedgerEntry = exports.getPatientBalance = exports.getLedgerEntryById = exports.getAllPatientLedgerService = exports.createLedgerEntry = void 0;
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
        return entry.amountType === "Credit" ? balance + amount : balance - amount;
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
        filterObj.amountType = { equals: amountType, mode: "insensitive" };
    if (paymentMode)
        filterObj.paymentMode = { equals: paymentMode, mode: "insensitive" };
    if (fromDate || toDate)
        filterObj.date = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "patientLedger",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterPatientLedgerService = filterPatientLedgerService;
const getLedgerFlowSummary = async () => {
    // Helper function to calculate Money In & Out for a model
    const calcLedgerFlow = async (model, moneyInType, moneyOutType) => {
        const moneyIn = await model.aggregate({
            _sum: { amount: true },
            where: { amountType: moneyInType },
        });
        const moneyOut = await model.aggregate({
            _sum: { amount: true },
            where: { amountType: moneyOutType },
        });
        const inAmount = Number(moneyIn._sum.amount || 0);
        const outAmount = Number(moneyOut._sum.amount || 0);
        return {
            moneyIn: inAmount,
            moneyOut: outAmount,
            netBalance: inAmount - outAmount,
        };
    };
    // Ledger calculations
    const patientLedger = await calcLedgerFlow(prisma_1.prisma.patientLedger, "Credit", "Debit");
    const doctorLedger = await calcLedgerFlow(prisma_1.prisma.doctorLedger, "Credit", "Debit");
    const bankLedger = await calcLedgerFlow(prisma_1.prisma.bankLedger, "Credit", "Debit");
    const cashLedger = await calcLedgerFlow(prisma_1.prisma.cashLedger, "Income", "Expense");
    // Totals
    const totalMoneyIn = patientLedger.moneyIn +
        doctorLedger.moneyIn +
        cashLedger.moneyIn +
        bankLedger.moneyIn;
    const totalMoneyOut = patientLedger.moneyOut +
        doctorLedger.moneyOut +
        cashLedger.moneyOut +
        bankLedger.moneyOut;
    return {
        ledgers: {
            patient: patientLedger,
            doctor: doctorLedger,
            cash: cashLedger,
            bank: bankLedger,
        },
        totals: {
            totalMoneyIn,
            totalMoneyOut,
            overallNetBalance: totalMoneyIn - totalMoneyOut,
        },
    };
};
exports.getLedgerFlowSummary = getLedgerFlowSummary;
