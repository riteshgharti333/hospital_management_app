"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientAgeDistribution = exports.getPatientAnalytics = exports.filterPatientsService = exports.searchPatient = exports.deletePatient = exports.updatePatient = exports.getPatientById = exports.getAllPatients = exports.createPatient = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const filterPaginate_1 = require("../utils/filterPaginate");
const searchCache_1 = require("../utils/searchCache");
const createPatient = async (data) => {
    return prisma_1.prisma.patient.create({ data });
};
exports.createPatient = createPatient;
const getAllPatients = async () => {
    return prisma_1.prisma.patient.findMany({ orderBy: { createdAt: "desc" } });
};
exports.getAllPatients = getAllPatients;
const getPatientById = async (id) => {
    return prisma_1.prisma.patient.findUnique({ where: { id } });
};
exports.getPatientById = getPatientById;
// export const getPatientByAadhaar = async (aadhaarNumber: string) => {
//   return prisma.patient.findUnique({ where: { aadhaarNumber } });
// };
const updatePatient = async (id, data) => {
    return prisma_1.prisma.patient.update({
        where: { id },
        data,
    });
};
exports.updatePatient = updatePatient;
const deletePatient = async (id) => {
    return prisma_1.prisma.patient.delete({ where: { id } });
};
exports.deletePatient = deletePatient;
const commonSearchFields = ["fullName", "mobileNumber", "aadhaarNumber"];
exports.searchPatient = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Patient",
    cacheKeyPrefix: "patient",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterPatientsService = async (filters) => {
    const { fromDate, toDate, gender, cursor, limit } = filters;
    const filterObj = {};
    if (gender)
        filterObj.gender = { equals: gender, mode: "insensitive" };
    if (fromDate || toDate)
        filterObj.createdAt = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "patient",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterPatientsService = filterPatientsService;
const getPatientAnalytics = async () => {
    const now = new Date();
    // ============= TIME RANGES =============
    // Last 3 Months
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    // Last 6 Months
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    // Last 1 Year
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    // Current Month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    // Previous Month
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    // Helper function to count patients in a date range
    const countPatients = async (from, to) => {
        const where = {};
        if (from || to) {
            where.createdAt = {
                gte: from,
                lte: to || now,
            };
        }
        return prisma_1.prisma.patient.count({ where });
    };
    // % logic
    const percent = (curr, prev) => {
        if (!prev)
            return 0;
        return Number((((curr - prev) / prev) * 100).toFixed(2));
    };
    // Compute values
    const currentMonth = await countPatients(currentMonthStart);
    const previousMonth = await countPatients(previousMonthStart, previousMonthEnd);
    return {
        total: await prisma_1.prisma.patient.count(),
        // Updated ranges
        threeMonths: await countPatients(threeMonthsAgo),
        sixMonths: await countPatients(sixMonthsAgo),
        oneYear: await countPatients(oneYearAgo),
        currentMonth,
        previousMonth,
        percentChange: percent(currentMonth, previousMonth),
    };
};
exports.getPatientAnalytics = getPatientAnalytics;
const getPatientAgeDistribution = async () => {
    // Fetch only required fields for speed
    const patients = await prisma_1.prisma.patient.findMany({
        select: { age: true }
    });
    const groups = {
        "0-10": 0,
        "11-20": 0,
        "21-30": 0,
        "31-40": 0,
        "41-50": 0,
        "51-60": 0,
        "61-70": 0,
        "71+": 0
    };
    let totalAge = 0;
    patients.forEach((p) => {
        totalAge += p.age;
        if (p.age <= 10)
            groups["0-10"]++;
        else if (p.age <= 20)
            groups["11-20"]++;
        else if (p.age <= 30)
            groups["21-30"]++;
        else if (p.age <= 40)
            groups["31-40"]++;
        else if (p.age <= 50)
            groups["41-50"]++;
        else if (p.age <= 60)
            groups["51-60"]++;
        else if (p.age <= 70)
            groups["61-70"]++;
        else
            groups["71+"]++;
    });
    const averageAge = patients.length === 0
        ? 0
        : Number((totalAge / patients.length).toFixed(1));
    // determine which age group is the mode (highest count)
    let modeGroup = "";
    let highest = 0;
    for (const [key, value] of Object.entries(groups)) {
        if (value > highest) {
            highest = value;
            modeGroup = key;
        }
    }
    return {
        groups, // counts for chart
        averageAge, // bottom text
        modeGroup, // “Most: 31–40 yrs”
        modeCount: highest
    };
};
exports.getPatientAgeDistribution = getPatientAgeDistribution;
