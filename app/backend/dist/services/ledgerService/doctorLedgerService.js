"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctorLedgerEntry = exports.updateDoctorLedgerEntry = exports.getDoctorBalance = exports.getDoctorLedgerEntryById = exports.getAllDoctorLedgerEntries = exports.createDoctorLedgerEntry = void 0;
const prisma_1 = require("../../lib/prisma");
const createDoctorLedgerEntry = async (data) => {
    return prisma_1.prisma.doctorLedger.create({ data });
};
exports.createDoctorLedgerEntry = createDoctorLedgerEntry;
const getAllDoctorLedgerEntries = async (filters) => {
    const where = {};
    if (filters.doctorName) {
        where.doctorName = filters.doctorName;
    }
    if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate)
            where.date.gte = filters.startDate;
        if (filters.endDate)
            where.date.lte = filters.endDate;
    }
    if (filters.amountType) {
        where.amountType = filters.amountType;
    }
    return prisma_1.prisma.doctorLedger.findMany({
        where,
        orderBy: { date: "desc" },
    });
};
exports.getAllDoctorLedgerEntries = getAllDoctorLedgerEntries;
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
