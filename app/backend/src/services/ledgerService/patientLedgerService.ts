import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createLedgerEntry = async (data: {
  patientName: string;
  date: Date;
  description: string;
  amountType: string;
  amount: number;
  paymentMode: string;
  transactionId?: string;
  remarks?: string;
}) => {
  return prisma.patientLedger.create({ data });
};

export const getAllLedgerEntries = async (filters: {
  patientName?: string;
  startDate?: Date;
  endDate?: Date;
  amountType?: string;
}) => {
  const where: any = {};

  if (filters.patientName) {
    where.patientName = filters.patientName;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = filters.startDate;
    if (filters.endDate) where.date.lte = filters.endDate;
  }

  if (filters.amountType) {
    where.amountType = filters.amountType;
  }

  return prisma.patientLedger.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

export const getLedgerEntryById = async (id: number) => {
  return prisma.patientLedger.findUnique({ where: { id } });
};

export const getPatientBalance = async (patientName: string) => {
  const entries = await prisma.patientLedger.findMany({
    where: { patientName },
    select: { amountType: true, amount: true },
  });

  return entries.reduce((balance, entry) => {
    const amount = entry.amount.toNumber();
    return entry.amountType === "Credit" ? balance + amount : balance - amount;
  }, 0);
};

export const updateLedgerEntry = async (
  id: number,
  data: {
    patientName?: string;
    date?: Date;
    description?: string;
    amountType?: string;
    amount?: number;
    paymentMode?: string;
    transactionId?: string;
    remarks?: string;
  }
) => {
  return prisma.patientLedger.update({
    where: { id },
    data,
  });
};

export const deleteLedgerEntry = async (id: number) => {
  return prisma.patientLedger.delete({ where: { id } });
};
