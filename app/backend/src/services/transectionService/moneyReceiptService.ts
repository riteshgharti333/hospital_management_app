import { prisma } from "../../lib/prisma";
import { applyCommonFields } from "../../utils/applyCommonFields";
import { filterPaginate } from "../../utils/filterPaginate";
import { cursorPaginate } from "../../utils/pagination";
import { createSearchService } from "../../utils/searchCache";

export type MoneyReceiptInput = {
  date: Date;
  patientName: string;
  admissionNo: string;
  mobile: string;
  amount: number;
  paymentMode: string;
  remarks?: string;
  receivedBy: string;
  status?: string;
};

export const createMoneyReceipt = async (data: MoneyReceiptInput) => {
  return prisma.moneyReceipt.create({ data });
};

export const getAllMoneyReceiptsService = async (
  cursor?: string,
  limit?: number
) => {
  return cursorPaginate(
    prisma,
    {
      model: "moneyReceipt",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getMoneyReceiptById = async (id: number) => {
  return prisma.moneyReceipt.findUnique({ where: { id } });
};

export const getMoneyReceiptsByDateRange = async (
  startDate: Date,
  endDate: Date
) => {
  return prisma.moneyReceipt.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "desc" },
  });
};

export const updateMoneyReceipt = async (
  id: number,
  data: Partial<MoneyReceiptInput>
) => {
  return prisma.moneyReceipt.update({
    where: { id },
    data,
  });
};

export const deleteMoneyReceipt = async (id: number) => {
  return prisma.moneyReceipt.delete({ where: { id } });
};

const moneyReceiptSearchFields = ["patientName", "mobile", "admissionNo"];

export const searchMoneyReceipts = createSearchService(prisma, {
  tableName: "MoneyReceipt",
  cacheKeyPrefix: "moneyreceipt",
  ...applyCommonFields(moneyReceiptSearchFields),
});

export const filterMoneyReceiptsService = async (filters: {
  fromDate?: Date;
  toDate?: Date;
  paymentMode?: string;
  status?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, paymentMode, status, cursor, limit } = filters;

  const filterObj: Record<string, any> = {};

  if (paymentMode) filterObj.paymentMode = paymentMode;
  if (status) filterObj.status = status;

  if (fromDate || toDate) {
    filterObj.date = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "moneyReceipt",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};

const format = (num: number) => Number(num.toFixed(2));

export const getRevenueAnalytics = async () => {
  const now = new Date();

  const format = (num: number) => Number(num.toFixed(2));

  // ============================
  // DATE RANGES
  // ============================
  const threeMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 3,
    now.getDate()
  );

  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 6,
    now.getDate()
  );

  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  );

  // MONTH SPECIFIC RANGES
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // ============================
  // HELPER
  // ============================
  const sumRevenue = async (from: Date, to: Date = now) => {
    const result = await prisma.moneyReceipt.aggregate({
      _sum: { amount: true },
      where: { date: { gte: from, lte: to } },
    });
    return format(result._sum.amount || 0);
  };

  // ============================
  // MAIN VALUES
  // ============================
  const threeMonths = await sumRevenue(threeMonthsAgo);
  const sixMonths = await sumRevenue(sixMonthsAgo);
  const oneYear = await sumRevenue(oneYearAgo);

  const totalAgg = await prisma.moneyReceipt.aggregate({
    _sum: { amount: true },
  });

  const total = format(totalAgg._sum.amount || 0);

  // ============================
  // CURRENT VS PREVIOUS MONTH
  // ============================
  const currentMonth = await sumRevenue(currentMonthStart);
  const previousMonth = await sumRevenue(previousMonthStart, previousMonthEnd);

  const percentChange = previousMonth
    ? format(((currentMonth - previousMonth) / previousMonth) * 100)
    : 0;

  return {
    threeMonths,
    sixMonths,
    oneYear,
    total,

    currentMonth,
    previousMonth,
    percentChange,
  };
};


export const getPaymentModeBreakdownAnalytics = async () => {
  const paymentModes = [
    "Online Transfer",
    "Card",
    "Cash",
    "Cheque",
    "Other"
  ];

  const now = new Date();

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  // Helpers
  const sumAmount = async (where: any) => {
    const result = await prisma.moneyReceipt.aggregate({
      _sum: { amount: true },
      where
    });
    return result._sum.amount || 0;
  };

  const buildStats = async (from?: Date) => {
    const where = from ? { date: { gte: from, lte: now } } : {};

    const totalAmount = await sumAmount(where);

    const amounts = await Promise.all(
      paymentModes.map((mode) =>
        sumAmount({ ...where, paymentMode: mode })
      )
    );

    const percentages = amounts.map((amt) =>
      totalAmount === 0 ? 0 : Number(((amt / totalAmount) * 100).toFixed(2))
    );

    return {
      totalAmount: Number(totalAmount.toFixed(2)),
      paymentModes,
      amounts: amounts.map((a) => Number(a.toFixed(2))),
      percentages,
    };
  };

  return {
    allTime: await buildStats(),
    threeMonths: await buildStats(threeMonthsAgo),
    sixMonths: await buildStats(sixMonthsAgo),
    oneYear: await buildStats(oneYearAgo),
  };
};