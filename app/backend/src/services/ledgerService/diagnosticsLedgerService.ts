import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDiagnosticsEntry = async (data: {
  patientName: string;
  date: Date;
  testName: string;
  description: string;
  amount: number;
  paymentMode: string;
  attachReport?: string;
  remarks?: string;
}) => {
  return prisma.diagnosticsLedger.create({ data });
};

export const getAllDiagnosticsEntries = async (filters: {
  patientName?: string;
  startDate?: Date;
  endDate?: Date;
  testName?: string;
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

  if (filters.testName) {
    where.testName = filters.testName;
  }

  return prisma.diagnosticsLedger.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

export const getDiagnosticsEntryById = async (id: number) => {
  return prisma.diagnosticsLedger.findUnique({ where: { id } });
};

export const getPatientDiagnosticsTotal = async (patientName: string) => {
  const entries = await prisma.diagnosticsLedger.findMany({
    where: { patientName },
    select: { amount: true },
  });

  return entries.reduce((total, entry) => total + entry.amount.toNumber(), 0);
};

export const updateDiagnosticsEntry = async (
  id: number,
  data: {
    patientName?: string;
    date?: Date;
    testName?: string;
    description?: string;
    amount?: number;
    paymentMode?: string;
    attachReport?: string;
    remarks?: string;
  }
) => {
  return prisma.diagnosticsLedger.update({
    where: { id },
    data,
  });
};

export const deleteDiagnosticsEntry = async (id: number) => {
  return prisma.diagnosticsLedger.delete({ where: { id } });
};
