"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBillsService = exports.searchBills = exports.deleteBill = exports.updateBill = exports.getBillsByPatient = exports.getBillById = exports.getAllBillsService = exports.createBill = void 0;
const prisma_1 = require("../../lib/prisma");
const filterPaginate_1 = require("../../utils/filterPaginate");
const pagination_1 = require("../../utils/pagination");
const searchCache_1 = require("../../utils/searchCache");
const cacheVersion_1 = require("../../utils/cacheVersion");
const createBill = async (data) => {
    // Calculate each item's totalAmount (qty × mrp)
    const processedItems = data.billItems.map((item) => ({
        company: item.company,
        itemOrService: item.itemOrService,
        quantity: item.quantity,
        mrp: item.mrp,
        totalAmount: item.totalAmount ?? item.mrp * item.quantity,
    }));
    // Calculate full bill total (sum of all items)
    const billTotalAmount = processedItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    await (0, cacheVersion_1.bumpCacheVersion)("bill");
    // Create bill with Prisma
    const billData = {
        billDate: new Date(data.billDate),
        billType: data.billType,
        mobile: data.mobile,
        admissionNo: data.admissionNo,
        patientName: data.patientName,
        admissionDate: new Date(data.admissionDate),
        patientSex: data.patientSex,
        dischargeDate: data.dischargeDate ? new Date(data.dischargeDate) : null,
        totalAmount: billTotalAmount, // Use calculated total, not data.totalAmount
        address: data.address,
        status: data.status,
        billItems: {
            create: processedItems,
        },
    };
    await (0, cacheVersion_1.bumpCacheVersion)("bill");
    return prisma_1.prisma.bill.create({
        data: billData,
        include: { billItems: true },
    });
};
exports.createBill = createBill;
const getAllBillsService = async (cursor) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, { model: "bill" }, cursor);
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
    const processedItems = data.billItems?.map((item) => {
        const total = item.totalAmount ?? item.mrp * item.quantity;
        return {
            ...item,
            totalAmount: total,
        };
    }) || [];
    const grandTotal = processedItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    await (0, cacheVersion_1.bumpCacheVersion)("bill");
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
    await (0, cacheVersion_1.bumpCacheVersion)("bill");
    return prisma_1.prisma.bill.delete({
        where: { id },
        include: { billItems: true },
    });
};
exports.deleteBill = deleteBill;
exports.searchBills = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "bill",
    exactFields: ["admissionNo"],
    prefixFields: ["admissionNo", "patientName"],
    similarFields: ["patientName", "mobile"],
    // selectFields: [
    //   "id",
    //   "admissionNo",
    //   "patientName",
    //   "mobile",
    //   "amount",
    //   "paymentMode",
    //   "date",
    //   "status",
    //   "createdAt",
    // ],
});
const filterBillsService = async (params) => {
    const { fromDate, toDate, billType, patientSex, status, cursor, limit } = params;
    const where = {};
    // ✅ Bill Type filter
    if (billType) {
        where.billType = {
            equals: billType,
            mode: "insensitive",
        };
    }
    // ✅ Patient Sex filter
    if (patientSex) {
        where.patientSex = {
            equals: patientSex,
            mode: "insensitive",
        };
    }
    // ✅ Status filter
    if (status) {
        where.status = {
            equals: status,
            mode: "insensitive",
        };
    }
    // ✅ Date range filter (using 'billDate' field)
    if (fromDate || toDate) {
        where.billDate = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "bill",
        limit,
    }, cursor, where);
};
exports.filterBillsService = filterBillsService;
