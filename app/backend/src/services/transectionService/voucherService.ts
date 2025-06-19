import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type VoucherInput = {
  voucherDate: Date;
  paymentFor: string;
  voucherType: string;
  vendorName: string;
  paymentDate: Date;
  amount: number;
  paymentMode: string;
  referenceNo?: string;
  description?: string;
  status?: string;
};

export const createVoucher = async (data: VoucherInput) => {
  return prisma.voucher.create({ data });
};

export const getAllVouchers = async () => {
  return prisma.voucher.findMany({
    orderBy: { voucherDate: "desc" },
  });
};

export const getVoucherById = async (id: number) => {
  return prisma.voucher.findUnique({ where: { id } });
};

export const getVouchersByVendor = async (vendorName: string) => {
  return prisma.voucher.findMany({
    where: { vendorName },
    orderBy: { voucherDate: "desc" },
  });
};

export const getVouchersByDateRange = async (startDate: Date, endDate: Date) => {
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

export const updateVoucher = async (id: number, data: Partial<VoucherInput>) => {
  return prisma.voucher.update({
    where: { id },
    data,
  });
};

export const deleteVoucher = async (id: number) => {
  return prisma.voucher.delete({ where: { id } });
};
