"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInsuranceLedgerEntry = exports.updateInsuranceLedgerEntry = exports.getInsuranceSummary = exports.getInsuranceLedgerEntryById = exports.getAllInsuranceLedgerEntries = exports.createInsuranceLedgerEntry = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createInsuranceLedgerEntry = async (data) => {
    return prisma.insuranceLedger.create({ data });
};
exports.createInsuranceLedgerEntry = createInsuranceLedgerEntry;
const getAllInsuranceLedgerEntries = async (filters) => {
    const where = {};
    if (filters.patientName) {
        where.patientName = filters.patientName;
    }
    if (filters.tpaInsuranceCompany) {
        where.tpaInsuranceCompany = filters.tpaInsuranceCompany;
    }
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.startDate || filters.endDate) {
        where.claimDate = {};
        if (filters.startDate)
            where.claimDate.gte = filters.startDate;
        if (filters.endDate)
            where.claimDate.lte = filters.endDate;
    }
    return prisma.insuranceLedger.findMany({
        where,
        orderBy: { claimDate: 'desc' }
    });
};
exports.getAllInsuranceLedgerEntries = getAllInsuranceLedgerEntries;
const getInsuranceLedgerEntryById = async (id) => {
    return prisma.insuranceLedger.findUnique({ where: { id } });
};
exports.getInsuranceLedgerEntryById = getInsuranceLedgerEntryById;
const getInsuranceSummary = async () => {
    const summary = await prisma.insuranceLedger.groupBy({
        by: ['tpaInsuranceCompany', 'status'],
        _sum: {
            claimAmount: true,
            approvedAmount: true,
            settledAmount: true
        },
        orderBy: {
            tpaInsuranceCompany: 'asc'
        }
    });
    const totals = await prisma.insuranceLedger.aggregate({
        _sum: {
            claimAmount: true,
            approvedAmount: true,
            settledAmount: true
        }
    });
    return { summary, totals: totals._sum };
};
exports.getInsuranceSummary = getInsuranceSummary;
const updateInsuranceLedgerEntry = async (id, data) => {
    return prisma.insuranceLedger.update({
        where: { id },
        data,
    });
};
exports.updateInsuranceLedgerEntry = updateInsuranceLedgerEntry;
const deleteInsuranceLedgerEntry = async (id) => {
    return prisma.insuranceLedger.delete({ where: { id } });
};
exports.deleteInsuranceLedgerEntry = deleteInsuranceLedgerEntry;
