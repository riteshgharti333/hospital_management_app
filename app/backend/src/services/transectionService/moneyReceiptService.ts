import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type MoneyReceiptInput = {
  date: Date;
  patientName: string;
  mobile: string;
  amount: number;
  paymentMode: string;
  remarks?: string;
  receivedBy: string;
  status?: string;
};

export const createMoneyReceipt = async (data: MoneyReceiptInput) => {
  return prisma.moneyReceipt.create({ data });
};

export const getAllMoneyReceipts = async (filters?: {
  mobile?: string;
  patientName?: string;
  amount?: number;
  paymentMode?: string;
}) => {
  const where: any = {};

  if (filters?.mobile) {
    where.mobile = { contains: filters.mobile };
  }

  if (filters?.patientName) {
    where.patientName = {
      contains: filters.patientName,
      mode: "insensitive",
    };
  }

  if (filters?.amount) {
    where.amount = filters.amount;
  }

  if (filters?.paymentMode) {
    where.paymentMode = filters.paymentMode;
  }

  return prisma.moneyReceipt.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

export const getMoneyReceiptById = async (id: number) => {
  return prisma.moneyReceipt.findUnique({ where: { id } });
};

export const getMoneyReceiptsByDateRange = async (
  startDate: Date,
  endDate: Date
) => {
  return prisma.moneyReceipt.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "desc" },
  });
};

export const updateMoneyReceipt = async (
  id: number,
  data: Partial<MoneyReceiptInput>
) => {
  return prisma.moneyReceipt.update({
    where: { id },
    data,
  });
};

export const deleteMoneyReceipt = async (id: number) => {
  return prisma.moneyReceipt.delete({ where: { id } });
};
