"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVoucher = exports.updateVoucher = exports.getVouchersByDateRange = exports.getVouchersByVendor = exports.getVoucherById = exports.getAllVouchers = exports.createVoucher = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createVoucher = async (data) => {
    return prisma.voucher.create({ data });
};
exports.createVoucher = createVoucher;
const getAllVouchers = async () => {
    return prisma.voucher.findMany({
        orderBy: { voucherDate: "desc" },
    });
};
exports.getAllVouchers = getAllVouchers;
const getVoucherById = async (id) => {
    return prisma.voucher.findUnique({ where: { id } });
};
exports.getVoucherById = getVoucherById;
const getVouchersByVendor = async (vendorName) => {
    return prisma.voucher.findMany({
        where: { vendorName },
        orderBy: { voucherDate: "desc" },
    });
};
exports.getVouchersByVendor = getVouchersByVendor;
const getVouchersByDateRange = async (startDate, endDate) => {
    return prisma.voucher.findMany({
        where: {
            voucherDate: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { voucherDate: "desc" },
    });
};
exports.getVouchersByDateRange = getVouchersByDateRange;
const updateVoucher = async (id, data) => {
    return prisma.voucher.update({
        where: { id },
        data,
    });
};
exports.updateVoucher = updateVoucher;
const deleteVoucher = async (id) => {
    return prisma.voucher.delete({ where: { id } });
};
exports.deleteVoucher = deleteVoucher;
