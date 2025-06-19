import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createExpenseEntry = async (data: {
  expenseCategory: string;
  date: Date;
  description: string;
  amount: number;
  paymentMode: string;
  transactionId?: string;
  remarks?: string;
}) => {
  return prisma.expenseLedger.create({ data });
};

export const getAllExpenseEntries = async (filters: {
  expenseCategory?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  const where: any = {};
  
  if (filters.expenseCategory) {
    where.expenseCategory = filters.expenseCategory;
  }
  
  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = filters.startDate;
    if (filters.endDate) where.date.lte = filters.endDate;
  }

  return prisma.expenseLedger.findMany({
    where,
    orderBy: { date: 'desc' }
  });
};

export const getExpenseEntryById = async (id: number) => {
  return prisma.expenseLedger.findUnique({ where: { id } });
};

export const getExpenseSummaryByCategory = async () => {
  return prisma.expenseLedger.groupBy({
    by: ['expenseCategory'],
    _sum: {
      amount: true
    },
    orderBy: {
      _sum: {
        amount: 'desc'
      }
    }
  });
};

export const getTotalExpenses = async () => {
  const result = await prisma.expenseLedger.aggregate({
    _sum: {
      amount: true
    }
  });
  return result._sum.amount || 0;
};

export const updateExpenseEntry = async (
  id: number,
  data: {
    expenseCategory?: string;
    date?: Date;
    description?: string;
    amount?: number;
    paymentMode?: string;
    transactionId?: string;
    remarks?: string;
  }
) => {
  return prisma.expenseLedger.update({
    where: { id },
    data,
  });
};

export const deleteExpenseEntry = async (id: number) => {
  return prisma.expenseLedger.delete({ where: { id } });
};