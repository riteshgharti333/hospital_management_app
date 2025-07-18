"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteXrayReport = exports.updateXrayReport = exports.getDoctorWiseSummary = exports.getFinancialSummary = exports.getXrayReportById = exports.getAllXrayReports = exports.createXrayReport = void 0;
const prisma_1 = require("../lib/prisma");
const createXrayReport = async (data) => {
    return prisma_1.prisma.xrayReport.create({ data });
};
exports.createXrayReport = createXrayReport;
const getAllXrayReports = async (filters) => {
    const where = {};
    if (filters.patientMobile)
        where.patientMobile = filters.patientMobile;
    if (filters.patientName)
        where.patientName = filters.patientName;
    if (filters.referredDoctor)
        where.referredDoctor = filters.referredDoctor;
    if (filters.department)
        where.department = filters.department;
    if (filters.startDate || filters.endDate) {
        where.billDate = {};
        if (filters.startDate)
            where.billDate.gte = filters.startDate;
        if (filters.endDate)
            where.billDate.lte = filters.endDate;
    }
    return prisma_1.prisma.xrayReport.findMany({
        where,
        orderBy: { billDate: "desc" }
    });
};
exports.getAllXrayReports = getAllXrayReports;
const getXrayReportById = async (id) => {
    return prisma_1.prisma.xrayReport.findUnique({ where: { id } });
};
exports.getXrayReportById = getXrayReportById;
const getFinancialSummary = async () => {
    const [totalBillAmount, totalNetAmount, totalDoctorEarning] = await Promise.all([
        prisma_1.prisma.xrayReport.aggregate({ _sum: { billAmount: true } }),
        prisma_1.prisma.xrayReport.aggregate({ _sum: { netBillAmount: true } }),
        prisma_1.prisma.xrayReport.aggregate({ _sum: { doctorEarning: true } })
    ]);
    return {
        totalBillAmount: totalBillAmount._sum.billAmount || 0,
        totalNetAmount: totalNetAmount._sum.netBillAmount || 0,
        totalDoctorEarning: totalDoctorEarning._sum.doctorEarning || 0
    };
};
exports.getFinancialSummary = getFinancialSummary;
const getDoctorWiseSummary = async () => {
    return prisma_1.prisma.xrayReport.groupBy({
        by: ["referredDoctor"],
        _sum: {
            doctorEarning: true,
            netBillAmount: true
        },
        orderBy: {
            _sum: {
                doctorEarning: "desc"
            }
        }
    });
};
exports.getDoctorWiseSummary = getDoctorWiseSummary;
const updateXrayReport = async (id, data) => {
    return prisma_1.prisma.xrayReport.update({
        where: { id },
        data
    });
};
exports.updateXrayReport = updateXrayReport;
const deleteXrayReport = async (id) => {
    return prisma_1.prisma.xrayReport.delete({ where: { id } });
};
exports.deleteXrayReport = deleteXrayReport;
