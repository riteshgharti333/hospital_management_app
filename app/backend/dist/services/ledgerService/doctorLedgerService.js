"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDoctorLedgerService = exports.searchDoctorLedger = exports.deleteDoctorLedgerEntry = exports.updateDoctorLedgerEntry = exports.getDoctorBalance = exports.getDoctorLedgerEntryById = exports.getAllDoctorLedgerService = exports.createDoctorLedgerEntry = void 0;
const prisma_1 = require("../../lib/prisma");
const applyCommonFields_1 = require("../../utils/applyCommonFields");
const filterPaginate_1 = require("../../utils/filterPaginate");
const pagination_1 = require("../../utils/pagination");
const searchCache_1 = require("../../utils/searchCache");
const createDoctorLedgerEntry = async (data) => {
    return prisma_1.prisma.doctorLedger.create({ data });
};
exports.createDoctorLedgerEntry = createDoctorLedgerEntry;
const getAllDoctorLedgerService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "doctorLedger",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllDoctorLedgerService = getAllDoctorLedgerService;
const getDoctorLedgerEntryById = async (id) => {
    return prisma_1.prisma.doctorLedger.findUnique({ where: { id } });
};
exports.getDoctorLedgerEntryById = getDoctorLedgerEntryById;
const getDoctorBalance = async (doctorName) => {
    const entries = await prisma_1.prisma.doctorLedger.findMany({
        where: { doctorName },
        select: { amountType: true, amount: true },
    });
    return entries.reduce((balance, entry) => {
        const amount = entry.amount.toNumber();
        return entry.amountType === "Credit" ? balance + amount : balance - amount;
    }, 0);
};
exports.getDoctorBalance = getDoctorBalance;
const updateDoctorLedgerEntry = async (id, data) => {
    return prisma_1.prisma.doctorLedger.update({
        where: { id },
        data,
    });
};
exports.updateDoctorLedgerEntry = updateDoctorLedgerEntry;
const deleteDoctorLedgerEntry = async (id) => {
    return prisma_1.prisma.doctorLedger.delete({ where: { id } });
};
exports.deleteDoctorLedgerEntry = deleteDoctorLedgerEntry;
const commonSearchFields = ["doctorName"];
exports.searchDoctorLedger = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "DoctorLedger",
    cacheKeyPrefix: "doctor-ledger",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterDoctorLedgerService = async (filters) => {
    const { amountType, paymentMode, fromDate, toDate, cursor, limit } = filters;
    const filterObj = {};
    if (amountType)
        filterObj.amountType = { equals: amountType, mode: "insensitive" };
    if (paymentMode)
        filterObj.paymentMode = { equals: paymentMode, mode: "insensitive" };
    if (fromDate || toDate) {
        filterObj.date = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "doctorLedger",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterDoctorLedgerService = filterDoctorLedgerService;
