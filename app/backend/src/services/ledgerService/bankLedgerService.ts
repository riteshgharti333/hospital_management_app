import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBankLedgerEntry = async (data: {
  bankName: string;
  date: Date;
  description: string;
  amountType: string;
  amount: number;
  transactionId?: string;
  remarks?: string;
}) => {
  return prisma.bankLedger.create({ data });
};

export const getAllBankLedgerEntries = async (filters: {
  bankName?: string;
  startDate?: Date;
  endDate?: Date;
  amountType?: string;
}) => {
  const where: any = {};

  if (filters.bankName) {
    where.bankName = filters.bankName;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = filters.startDate;
    if (filters.endDate) where.date.lte = filters.endDate;
  }

  if (filters.amountType) {
    where.amountType = filters.amountType;
  }

  return prisma.bankLedger.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

export const getBankLedgerEntryById = async (id: number) => {
  return prisma.bankLedger.findUnique({ where: { id } });
};

export const getBankBalance = async (bankName: string) => {
  const entries = await prisma.bankLedger.findMany({
    where: { bankName },
    select: { amountType: true, amount: true },
  });

  return entries.reduce((balance, entry) => {
    const amount = entry.amount.toNumber(); 
    return entry.amountType === "Credit" ? balance + amount : balance - amount;
  }, 0);
};

export const updateBankLedgerEntry = async (
  id: number,
  data: {
    bankName?: string;
    date?: Date;
    description?: string;
    amountType?: string;
    amount?: number;
    transactionId?: string;
    remarks?: string;
  }
) => {
  return prisma.bankLedger.update({
    where: { id },
    data,
  });
};

export const deleteBankLedgerEntry = async (id: number) => {
  return prisma.bankLedger.delete({ where: { id } });
};
