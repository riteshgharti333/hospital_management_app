"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmissionAnalytics = exports.getAdmissionGenderAnalytics = exports.getMonthlyAdmissionTrend = exports.filterAdmissionsService = exports.searchAdmissions = exports.deleteAdmission = exports.updateAdmission = exports.getAdmissionById = exports.getAllAdmissionsService = exports.createAdmission = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const filterPaginate_1 = require("../utils/filterPaginate");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const createAdmission = async (data) => {
    return prisma_1.prisma.admission.create({ data });
};
exports.createAdmission = createAdmission;
const getAllAdmissionsService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "admission",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllAdmissionsService = getAllAdmissionsService;
const getAdmissionById = async (id) => {
    return prisma_1.prisma.admission.findUnique({ where: { id } });
};
exports.getAdmissionById = getAdmissionById;
const updateAdmission = async (id, data) => {
    return prisma_1.prisma.admission.update({
        where: { id },
        data,
    });
};
exports.updateAdmission = updateAdmission;
const deleteAdmission = async (id) => {
    return prisma_1.prisma.admission.delete({ where: { id } });
};
exports.deleteAdmission = deleteAdmission;
const commonSearchFields = ["patientName", "gsRsRegNo", "phoneNo"];
exports.searchAdmissions = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Admission",
    cacheKeyPrefix: "admission",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
/// Filter
const filterAdmissionsService = async (filters) => {
    const { fromDate, toDate, patientSex, bloodGroup, cursor, limit } = filters;
    // Build filter object
    const filterObj = {};
    if (patientSex)
        filterObj.patientSex = { equals: patientSex, mode: "insensitive" };
    if (bloodGroup)
        filterObj.bloodGroup = bloodGroup;
    if (fromDate || toDate)
        filterObj.admissionDate = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    // Call filterPaginate
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "admission",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterAdmissionsService = filterAdmissionsService;
const getMonthlyAdmissionTrend = async () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Create 12 months empty counters
    const monthlyCounts = Array(12).fill(0);
    // Fetch all current year admissions
    const admissions = await prisma_1.prisma.admission.findMany({
        where: {
            admissionDate: {
                gte: new Date(currentYear, 0, 1),
                lte: now,
            },
        },
        select: { admissionDate: true },
    });
    // Fill monthly counts
    admissions.forEach((record) => {
        const monthIndex = new Date(record.admissionDate).getMonth();
        monthlyCounts[monthIndex] += 1;
    });
    // Trim future months
    const trimmedCounts = monthlyCounts.slice(0, now.getMonth() + 1);
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ].slice(0, trimmedCounts.length);
    // ----------------------------
    //  SIX-MONTH GROWTH CALCULATION
    // ----------------------------
    const currentStart = new Date(now);
    currentStart.setMonth(now.getMonth() - 5);
    const prevStart = new Date(now);
    prevStart.setMonth(now.getMonth() - 11);
    const prevEnd = new Date(now);
    prevEnd.setMonth(now.getMonth() - 6);
    const countAdmissions = async (from, to) => {
        return prisma_1.prisma.admission.count({
            where: {
                admissionDate: { gte: from, lte: to },
            },
        });
    };
    const current6 = await countAdmissions(currentStart, now);
    const previous6 = await countAdmissions(prevStart, prevEnd);
    const percentChange = previous6 === 0
        ? 0
        : Number((((current6 - previous6) / previous6) * 100).toFixed(2));
    return {
        months,
        counts: trimmedCounts,
        growth: {
            currentSixMonths: current6,
            previousSixMonths: previous6,
            percentChange,
        },
    };
};
exports.getMonthlyAdmissionTrend = getMonthlyAdmissionTrend;
const getAdmissionGenderAnalytics = async () => {
    // Count for all time admissions
    const totalAdmissions = await prisma_1.prisma.admission.count();
    // Count by gender
    const maleCount = await prisma_1.prisma.admission.count({
        where: { patientSex: "Male" },
    });
    const femaleCount = await prisma_1.prisma.admission.count({
        where: { patientSex: "Female" },
    });
    const otherCount = await prisma_1.prisma.admission.count({
        where: { patientSex: "Other" },
    });
    // Avoid division by zero
    const percent = (part) => totalAdmissions === 0
        ? 0
        : Number(((part / totalAdmissions) * 100).toFixed(2));
    return {
        totalAdmissions,
        male: {
            count: maleCount,
            percentage: percent(maleCount),
        },
        female: {
            count: femaleCount,
            percentage: percent(femaleCount),
        },
        other: {
            count: otherCount,
            percentage: percent(otherCount),
        },
    };
};
exports.getAdmissionGenderAnalytics = getAdmissionGenderAnalytics;
const getAdmissionAnalytics = async () => {
    const now = new Date();
    // --- TIME RANGES ---
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    // --- CURRENT MONTH RANGE ---
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    // --- PREVIOUS MONTH RANGE ---
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    // Count admissions by date range
    const countAdmissions = async (from, to) => {
        const where = {};
        if (from || to) {
            where.admissionDate = {
                gte: from,
                lte: to || now,
            };
        }
        return prisma_1.prisma.admission.count({ where });
    };
    const percent = (curr, prev) => {
        if (!prev)
            return 0;
        return Number((((curr - prev) / prev) * 100).toFixed(2));
    };
    const total = await prisma_1.prisma.admission.count();
    const currentMonth = await countAdmissions(currentMonthStart);
    const previousMonth = await countAdmissions(previousMonthStart, previousMonthEnd);
    return {
        total,
        threeMonths: await countAdmissions(threeMonthsAgo),
        sixMonths: await countAdmissions(sixMonthsAgo),
        oneYear: await countAdmissions(oneYearAgo),
        currentMonth,
        previousMonth,
        percentChange: percent(currentMonth, previousMonth),
    };
};
exports.getAdmissionAnalytics = getAdmissionAnalytics;
