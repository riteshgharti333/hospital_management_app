import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createInsuranceLedgerEntry = async (data: {
  patientName: string;
  tpaInsuranceCompany: string;
  claimAmount: number;
  approvedAmount?: number;
  settledAmount?: number;
  status: string;
  remarks?: string;
  claimDate: Date;
  approvalDate?: Date;
  settlementDate?: Date;
}) => {
  return prisma.insuranceLedger.create({ data });
};

export const getAllInsuranceLedgerEntries = async (filters: {
  patientName?: string;
  tpaInsuranceCompany?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  const where: any = {};
  
  if (filters.patientName) {
    where.patientName = filters.patientName;
  }
  
  if (filters.tpaInsuranceCompany) {
    where.tpaInsuranceCompany = filters.tpaInsuranceCompany;
  }
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  if (filters.startDate || filters.endDate) {
    where.claimDate = {};
    if (filters.startDate) where.claimDate.gte = filters.startDate;
    if (filters.endDate) where.claimDate.lte = filters.endDate;
  }

  return prisma.insuranceLedger.findMany({
    where,
    orderBy: { claimDate: 'desc' }
  });
};

export const getInsuranceLedgerEntryById = async (id: number) => {
  return prisma.insuranceLedger.findUnique({ where: { id } });
};

export const getInsuranceSummary = async () => {
  const summary = await prisma.insuranceLedger.groupBy({
    by: ['tpaInsuranceCompany', 'status'],
    _sum: {
      claimAmount: true,
      approvedAmount: true,
      settledAmount: true
    },
    orderBy: {
      tpaInsuranceCompany: 'asc'
    }
  });

  const totals = await prisma.insuranceLedger.aggregate({
    _sum: {
      claimAmount: true,
      approvedAmount: true,
      settledAmount: true
    }
  });

  return { summary, totals: totals._sum };
};

export const updateInsuranceLedgerEntry = async (
  id: number,
  data: {
    patientName?: string;
    tpaInsuranceCompany?: string;
    claimAmount?: number;
    approvedAmount?: number;
    settledAmount?: number;
    status?: string;
    remarks?: string;
    claimDate?: Date;
    approvalDate?: Date;
    settlementDate?: Date;
  }
) => {
  return prisma.insuranceLedger.update({
    where: { id },
    data,
  });
};

export const deleteInsuranceLedgerEntry = async (id: number) => {
  return prisma.insuranceLedger.delete({ where: { id } });
};