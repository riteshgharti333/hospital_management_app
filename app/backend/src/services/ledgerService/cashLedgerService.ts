import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCashLedgerEntry = async (data: {
  date: Date;
  purpose: string;
  amountType: string;
  amount: number;
  remarks?: string;
}) => {
  return prisma.cashLedger.create({ data });
};

export const getAllCashLedgerEntries = async (filters: {
  startDate?: Date;
  endDate?: Date;
  amountType?: string;
}) => {
  const where: any = {};

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = filters.startDate;
    if (filters.endDate) where.date.lte = filters.endDate;
  }

  if (filters.amountType) {
    where.amountType = filters.amountType;
  }

  return prisma.cashLedger.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

export const getCashLedgerEntryById = async (id: number) => {
  return prisma.cashLedger.findUnique({ where: { id } });
};

export const getCashBalance = async () => {
  const entries = await prisma.cashLedger.findMany({
    select: { amountType: true, amount: true },
  });

  return entries.reduce((balance, entry) => {
    const amount = entry.amount.toNumber(); // convert Decimal to number
    return entry.amountType === "Credit" ? balance + amount : balance - amount;
  }, 0);
};

export const updateCashLedgerEntry = async (
  id: number,
  data: {
    date?: Date;
    purpose?: string;
    amountType?: string;
    amount?: number;
    remarks?: string;
  }
) => {
  return prisma.cashLedger.update({
    where: { id },
    data,
  });
};

export const deleteCashLedgerEntry = async (id: number) => {
  return prisma.cashLedger.delete({ where: { id } });
};
