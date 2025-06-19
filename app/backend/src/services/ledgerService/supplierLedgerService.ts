import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSupplierLedgerEntry = async (data: {
  supplierName: string;
  date: Date;
  invoiceNo: string;
  description: string;
  amountType: string;
  amount: number;
  paymentMode?: string;
  transactionId?: string;
  attachBill?: string;
  remarks?: string;
}) => {
  return prisma.supplierLedger.create({ data });
};

export const getAllSupplierLedgerEntries = async (filters: {
  supplierName?: string;
  startDate?: Date;
  endDate?: Date;
  invoiceNo?: string;
  amountType?: string;
}) => {
  const where: any = {};

  if (filters.supplierName) {
    where.supplierName = filters.supplierName;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = filters.startDate;
    if (filters.endDate) where.date.lte = filters.endDate;
  }

  if (filters.invoiceNo) {
    where.invoiceNo = filters.invoiceNo;
  }

  if (filters.amountType) {
    where.amountType = filters.amountType;
  }

  return prisma.supplierLedger.findMany({
    where,
    orderBy: { date: "desc" },
  });
};

export const getSupplierLedgerEntryById = async (id: number) => {
  return prisma.supplierLedger.findUnique({ where: { id } });
};

export const getSupplierOutstanding = async (supplierName: string) => {
  const entries = await prisma.supplierLedger.findMany({
    where: { supplierName },
    select: { amountType: true, amount: true },
  });

  return entries.reduce((balance, entry) => {
    const amount = entry.amount.toNumber();
    return entry.amountType === "Credit" ? balance + amount : balance - amount;
  }, 0);
};

export const getSupplierSummary = async () => {
  return prisma.supplierLedger.groupBy({
    by: ["supplierName"],
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });
};

export const updateSupplierLedgerEntry = async (
  id: number,
  data: {
    supplierName?: string;
    date?: Date;
    invoiceNo?: string;
    description?: string;
    amountType?: string;
    amount?: number;
    paymentMode?: string;
    transactionId?: string;
    attachBill?: string;
    remarks?: string;
  }
) => {
  return prisma.supplierLedger.update({
    where: { id },
    data,
  });
};

export const deleteSupplierLedgerEntry = async (id: number) => {
  return prisma.supplierLedger.delete({ where: { id } });
};
