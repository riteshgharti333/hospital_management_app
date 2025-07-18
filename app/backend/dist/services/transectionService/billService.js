"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBill = exports.updateBill = exports.getBillsByPatient = exports.getBillById = exports.getAllBills = exports.createBill = void 0;
const prisma_1 = require("../../lib/prisma");
const createBill = async (data) => {
    const processedItems = data.billItems.map(item => ({
        ...item,
        totalAmount: item.totalAmount ?? item.mrp * item.quantity
    }));
    return prisma_1.prisma.bill.create({
        data: {
            ...data,
            billItems: {
                create: processedItems,
            },
        },
        include: { billItems: true },
    });
};
exports.createBill = createBill;
const getAllBills = async () => {
    return prisma_1.prisma.bill.findMany({
        orderBy: { createdAt: "desc" },
        include: { billItems: true },
    });
};
exports.getAllBills = getAllBills;
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
    const { billItems, ...rest } = data;
    const formattedUpdate = {
        ...(billItems?.create
            ? {
                create: billItems.create.map((item) => ({
                    ...item,
                    totalAmount: item.mrp * item.quantity,
                })),
            }
            : {}),
        ...(billItems?.update
            ? {
                update: billItems.update.map((updateItem) => ({
                    where: updateItem.where,
                    data: {
                        ...updateItem.data,
                        totalAmount: updateItem.data.mrp * updateItem.data.quantity,
                    },
                })),
            }
            : {}),
        ...(billItems?.delete
            ? {
                deleteMany: billItems.delete,
            }
            : {}),
    };
    return prisma_1.prisma.bill.update({
        where: { id },
        data: {
            ...rest,
            ...(billItems && {
                billItems: formattedUpdate,
            }),
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
