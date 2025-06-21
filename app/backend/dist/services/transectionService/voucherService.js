"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVoucher = exports.updateVoucher = exports.getVouchersByDateRange = exports.getVouchersByVendor = exports.getVoucherById = exports.getAllVouchers = exports.createVoucher = void 0;
const prisma_1 = require("../../lib/prisma");
const createVoucher = async (data) => {
    return prisma_1.prisma.voucher.create({ data });
};
exports.createVoucher = createVoucher;
const getAllVouchers = async () => {
    return prisma_1.prisma.voucher.findMany({
        orderBy: { voucherDate: "desc" },
    });
};
exports.getAllVouchers = getAllVouchers;
const getVoucherById = async (id) => {
    return prisma_1.prisma.voucher.findUnique({ where: { id } });
};
exports.getVoucherById = getVoucherById;
const getVouchersByVendor = async (vendorName) => {
    return prisma_1.prisma.voucher.findMany({
        where: { vendorName },
        orderBy: { voucherDate: "desc" },
    });
};
exports.getVouchersByVendor = getVouchersByVendor;
const getVouchersByDateRange = async (startDate, endDate) => {
    return prisma_1.prisma.voucher.findMany({
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
    return prisma_1.prisma.voucher.update({
        where: { id },
        data,
    });
};
exports.updateVoucher = updateVoucher;
const deleteVoucher = async (id) => {
    return prisma_1.prisma.voucher.delete({ where: { id } });
};
exports.deleteVoucher = deleteVoucher;
