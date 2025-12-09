"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBillsByStatusAnalytics = exports.getMonthlyBillingVsReceipt = exports.getBillStatusAnalytics = exports.filterBillsService = exports.searchBills = exports.deleteBill = exports.updateBill = exports.getBillsByPatient = exports.getBillById = exports.getAllBillsService = exports.createBill = void 0;
const prisma_1 = require("../../lib/prisma");
const applyCommonFields_1 = require("../../utils/applyCommonFields");
const filterPaginate_1 = require("../../utils/filterPaginate");
const pagination_1 = require("../../utils/pagination");
const searchCache_1 = require("../../utils/searchCache");
const createBill = async (data) => {
    // Calculate each item's totalAmount (qty × mrp)
    const processedItems = data.billItems.map((item) => ({
        ...item,
        totalAmount: item.totalAmount ?? item.mrp * item.quantity,
    }));
    // Calculate full bill total (sum of all items)
    const billTotalAmount = processedItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    return prisma_1.prisma.bill.create({
        data: {
            ...data,
            totalAmount: billTotalAmount,
            billItems: {
                create: processedItems,
            },
        },
        include: { billItems: true },
    });
};
exports.createBill = createBill;
const getAllBillsService = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "bill",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllBillsService = getAllBillsService;
const getBillById = async (id) => {
    return prisma_1.prisma.bill.findUnique({
        where: { id },
        include: { billItems: true },
    });
};
exports.getBillById = getBillById;
const getBillsByPatient = async (mobile) => {
    return prisma_1.prisma.bill.findMany({
        where: { mobile },
        orderBy: { billDate: "desc" },
        include: { billItems: true },
    });
};
exports.getBillsByPatient = getBillsByPatient;
const updateBill = async (id, data) => {
    // ⭐ Calculate each item's totalAmount
    const processedItems = data.billItems?.map((item) => {
        const total = item.totalAmount ?? item.mrp * item.quantity;
        return {
            ...item,
            totalAmount: total,
        };
    }) || [];
    // ⭐ Calculate totalAmount for the entire bill
    const grandTotal = processedItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    return prisma_1.prisma.bill.update({
        where: { id },
        data: {
            billDate: data.billDate,
            billType: data.billType,
            status: data.status,
            mobile: data.mobile,
            admissionNo: data.admissionNo,
            patientName: data.patientName,
            admissionDate: data.admissionDate,
            patientAge: data.patientAge,
            patientSex: data.patientSex,
            dischargeDate: data.dischargeDate ?? null,
            address: data.address,
            totalAmount: grandTotal, // ⭐ SAVE BILL TOTAL
            billItems: {
                deleteMany: {}, // Remove all old items
                create: processedItems.map((item) => ({
                    company: item.company,
                    itemOrService: item.itemOrService,
                    quantity: item.quantity,
                    mrp: item.mrp,
                    totalAmount: item.totalAmount,
                })),
            },
        },
        include: { billItems: true },
    });
};
exports.updateBill = updateBill;
const deleteBill = async (id) => {
    return prisma_1.prisma.bill.delete({
        where: { id },
        include: { billItems: true },
    });
};
exports.deleteBill = deleteBill;
const billSearchFields = ["admissionNo", "patientName", "mobile"];
exports.searchBills = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Bill",
    cacheKeyPrefix: "bill",
    ...(0, applyCommonFields_1.applyCommonFields)(billSearchFields),
});
const filterBillsService = async (filters) => {
    const { fromDate, toDate, billType, patientSex, status, cursor, limit } = filters;
    const filterObj = {};
    if (billType)
        filterObj.billType = billType;
    if (patientSex)
        filterObj.patientSex = patientSex;
    if (status)
        filterObj.status = status;
    if (fromDate || toDate)
        filterObj.billDate = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "bill",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterBillsService = filterBillsService;
const getBillStatusAnalytics = async () => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const statuses = [
        "Pending",
        "PartiallyPaid",
        "Paid",
        "Cancelled",
        "Refunded",
    ];
    // Count bills by status & date
    const countBills = async (status, from, to) => {
        const where = { status };
        if (from && to)
            where.billDate = { gte: from, lte: to };
        if (from && !to)
            where.billDate = { gte: from };
        return prisma_1.prisma.bill.count({ where });
    };
    const percent = (curr, prev) => {
        if (!prev)
            return 0;
        return Number((((curr - prev) / prev) * 100).toFixed(2));
    };
    const result = {};
    for (const s of statuses) {
        const total = await countBills(s);
        const currentMonth = await countBills(s, currentMonthStart, now);
        const previousMonth = await countBills(s, previousMonthStart, previousMonthEnd);
        result[s] = total; // total bill count
        result[`${s}Curr`] = currentMonth; // current month count
        result[`${s}Prev`] = previousMonth; // previous month count
        result[`${s}Change`] = percent(currentMonth, previousMonth); // % change
    }
    return result;
};
exports.getBillStatusAnalytics = getBillStatusAnalytics;
const getMonthlyBillingVsReceipt = async () => {
    const year = new Date().getFullYear();
    const format = (n) => Number(n.toFixed(2));
    // --------------------------------
    // 1. BILLING (sum of BillItem.totalAmount)
    // --------------------------------
    const billingQuery = await prisma_1.prisma.$queryRaw `
    SELECT 
      EXTRACT(MONTH FROM b."createdAt") AS month,
      SUM(b."totalAmount") AS total
    FROM "BillItem" b
    WHERE EXTRACT(YEAR FROM b."createdAt") = ${year}
    GROUP BY month
    ORDER BY month ASC;
  `;
    const billingMonthly = Array(12).fill(0);
    billingQuery.forEach((row) => {
        billingMonthly[row.month - 1] = format(Number(row.total));
    });
    // --------------------------------
    // 2. MONEY RECEIPTS
    // --------------------------------
    const receiptQuery = await prisma_1.prisma.$queryRaw `
    SELECT 
      EXTRACT(MONTH FROM "date") AS month,
      SUM("amount") AS total
    FROM "MoneyReceipt"
    WHERE EXTRACT(YEAR FROM "date") = ${year}
    GROUP BY month
    ORDER BY month ASC;
  `;
    const receiptMonthly = Array(12).fill(0);
    receiptQuery.forEach((row) => {
        receiptMonthly[row.month - 1] = format(Number(row.total));
    });
    // --------------------------------
    // 3. TOTALS
    // --------------------------------
    const totalBilling = format(billingMonthly.reduce((a, b) => a + b, 0));
    const totalReceipt = format(receiptMonthly.reduce((a, b) => a + b, 0));
    return {
        year,
        billingMonthly,
        receiptMonthly,
        totalBilling,
        totalReceipt,
    };
};
exports.getMonthlyBillingVsReceipt = getMonthlyBillingVsReceipt;
const getBillsByStatusAnalytics = async () => {
    const statuses = [
        "Pending",
        "PartiallyPaid",
        "Paid",
        "Cancelled",
        "Refunded",
    ];
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    // Helper: returns { totalBills, statuses, counts, percentages }
    const buildStatusStats = async (from) => {
        const where = {};
        if (from) {
            where.createdAt = { gte: from, lte: now };
        }
        const totalBills = await prisma_1.prisma.bill.count({ where });
        const counts = await Promise.all(statuses.map((status) => prisma_1.prisma.bill.count({
            where: { ...where, status },
        })));
        const percentages = counts.map((count) => totalBills === 0 ? 0 : Number(((count / totalBills) * 100).toFixed(2)));
        return {
            totalBills,
            statuses,
            counts,
            percentages,
        };
    };
    return {
        allTime: await buildStatusStats(),
        threeMonths: await buildStatusStats(threeMonthsAgo),
        sixMonths: await buildStatusStats(sixMonthsAgo),
        oneYear: await buildStatusStats(oneYearAgo),
    };
};
exports.getBillsByStatusAnalytics = getBillsByStatusAnalytics;
