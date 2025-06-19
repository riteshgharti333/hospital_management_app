import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDoctorLedgerEntry = async (data: {
  doctorName: string;
  date: Date;
  description: string;
  amountType: string;
  amount: number;
  paymentMode: string;
  transactionId?: string;
  remarks?: string;
}) => {
  return prisma.doctorLedger.create({ data });
};

export const getAllDoctorLedgerEntries = async (filters: {
  doctorName?: string;
  startDate?: Date;
  endDate?: Date;
  amountType?: string;
}) => {
  const where: any = {};

  if (filters.doctorName) {
    where.doctorName = filters.doctorName;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = filters.startDate;
    if (filters.endDate) where.date.lte = filters.endDate;
  }

  if (filters.amountType) {
    where.amountType = filters.amountType;
  }

  return prisma.doctorLedger.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

export const getDoctorLedgerEntryById = async (id: number) => {
  return prisma.doctorLedger.findUnique({ where: { id } });
};

export const getDoctorBalance = async (doctorName: string) => {
  const entries = await prisma.doctorLedger.findMany({
    where: { doctorName },
    select: { amountType: true, amount: true },
  });

  return entries.reduce((balance, entry) => {
    const amount = entry.amount.toNumber();
    return entry.amountType === "Credit" ? balance + amount : balance - amount;
  }, 0);
};

export const updateDoctorLedgerEntry = async (
  id: number,
  data: {
    doctorName?: string;
    date?: Date;
    description?: string;
    amountType?: string;
    amount?: number;
    paymentMode?: string;
    transactionId?: string;
    remarks?: string;
  }
) => {
  return prisma.doctorLedger.update({
    where: { id },
    data,
  });
};

export const deleteDoctorLedgerEntry = async (id: number) => {
  return prisma.doctorLedger.delete({ where: { id } });
};
