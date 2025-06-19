import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPharmacyLedgerEntry = async (data: {
  date: Date;
  medicineName: string;
  category: string;
  description: string;
  amountType: string;
  amount: number;
  paymentMode: string;
  remarks?: string;
}) => {
  return prisma.pharmacyLedger.create({ data });
};

export const getAllPharmacyLedgerEntries = async (filters: {
  startDate?: Date;
  endDate?: Date;
  medicineName?: string;
  category?: string;
  amountType?: string;
}) => {
  const where: any = {};

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = filters.startDate;
    if (filters.endDate) where.date.lte = filters.endDate;
  }

  if (filters.medicineName) {
    where.medicineName = filters.medicineName;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.amountType) {
    where.amountType = filters.amountType;
  }

  return prisma.pharmacyLedger.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

export const getPharmacyLedgerEntryById = async (id: number) => {
  return prisma.pharmacyLedger.findUnique({ where: { id } });
};

export const getPharmacySummary = async () => {
  const income = await prisma.pharmacyLedger.aggregate({
    _sum: { amount: true },
    where: { amountType: "Income" },
  });

  const expense = await prisma.pharmacyLedger.aggregate({
    _sum: { amount: true },
    where: { amountType: "Expense" },
  });

  return {
    totalIncome: income._sum.amount?.toNumber() || 0,
    totalExpense: expense._sum.amount?.toNumber() || 0,
    netProfit:
      (income._sum.amount?.toNumber() || 0) -
      (expense._sum.amount?.toNumber() || 0),
  };
};

export const getCategoryWiseSummary = async () => {
  return prisma.pharmacyLedger.groupBy({
    by: ["category", "amountType"],
    _sum: { amount: true },
    orderBy: { category: "asc" },
  });
};

export const updatePharmacyLedgerEntry = async (
  id: number,
  data: {
    date?: Date;
    medicineName?: string;
    category?: string;
    description?: string;
    amountType?: string;
    amount?: number;
    paymentMode?: string;
    remarks?: string;
  }
) => {
  return prisma.pharmacyLedger.update({
    where: { id },
    data,
  });
};

export const deletePharmacyLedgerEntry = async (id: number) => {
  return prisma.pharmacyLedger.delete({ where: { id } });
};
