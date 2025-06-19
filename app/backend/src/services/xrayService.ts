import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type XrayReportInput = {
  billDate: Date;
  patientMobile: string;
  patientName: string;
  patientSex: string;
  age: number;
  referredDoctor: string;
  testDate: Date;
  reportDate: Date;
  patientAddress?: string;
  examDescription: string;
  department: string;
  billAmount: number;
  discountPercent: number;
  netBillAmount: number;
  commissionPercent: number;
  doctorEarning: number;
};

type XrayReportUpdateInput = Partial<XrayReportInput>;

type XrayReportFilters = {
  patientMobile?: string;
  patientName?: string;
  referredDoctor?: string;
  startDate?: Date;
  endDate?: Date;
  department?: string;
};

export const createXrayReport = async (data: XrayReportInput) => {
  return prisma.xrayReport.create({ data });
};

export const getAllXrayReports = async (filters: XrayReportFilters) => {
  const where: any = {};

  if (filters.patientMobile) where.patientMobile = filters.patientMobile;
  if (filters.patientName) where.patientName = filters.patientName;
  if (filters.referredDoctor) where.referredDoctor = filters.referredDoctor;
  if (filters.department) where.department = filters.department;

  if (filters.startDate || filters.endDate) {
    where.billDate = {};
    if (filters.startDate) where.billDate.gte = filters.startDate;
    if (filters.endDate) where.billDate.lte = filters.endDate;
  }

  return prisma.xrayReport.findMany({
    where,
    orderBy: { billDate: "desc" }
  });
};

export const getXrayReportById = async (id: number) => {
  return prisma.xrayReport.findUnique({ where: { id } });
};

export const getFinancialSummary = async () => {
  const [totalBillAmount, totalNetAmount, totalDoctorEarning] = await Promise.all([
    prisma.xrayReport.aggregate({ _sum: { billAmount: true } }),
    prisma.xrayReport.aggregate({ _sum: { netBillAmount: true } }),
    prisma.xrayReport.aggregate({ _sum: { doctorEarning: true } })
  ]);

  return {
    totalBillAmount: totalBillAmount._sum.billAmount || 0,
    totalNetAmount: totalNetAmount._sum.netBillAmount || 0,
    totalDoctorEarning: totalDoctorEarning._sum.doctorEarning || 0
  };
};

export const getDoctorWiseSummary = async () => {
  return prisma.xrayReport.groupBy({
    by: ["referredDoctor"],
    _sum: {
      doctorEarning: true,
      netBillAmount: true
    },
    orderBy: {
      _sum: {
        doctorEarning: "desc"
      }
    }
  });
};

export const updateXrayReport = async (id: number, data: XrayReportUpdateInput) => {
  return prisma.xrayReport.update({
    where: { id },
    data
  });
};

export const deleteXrayReport = async (id: number) => {
  return prisma.xrayReport.delete({ where: { id } });
};
