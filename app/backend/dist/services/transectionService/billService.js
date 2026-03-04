"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBillsService = exports.searchBills = exports.deleteBill = exports.updateBill = exports.getBillsByPatient = exports.getBillById = exports.getAllBillsService = exports.createBill = void 0;
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
