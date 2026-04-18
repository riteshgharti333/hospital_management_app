import { prisma } from "../../lib/prisma";
import { bumpCacheVersion } from "../../utils/cacheVersion";
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
  await bumpCacheVersion("moneyreceipt");
  return prisma.moneyReceipt.create({ data });
};

export const getAllMoneyReceiptsService = async (cursor?: string) => {
  return cursorPaginate(prisma, { model: "moneyReceipt" }, cursor); // ✅ "moneyReceipt"
};

export const getMoneyReceiptById = async (id: number) => {
  return prisma.moneyReceipt.findUnique({ where: { id } });
};

export const getMoneyReceiptsByDateRange = async (
  startDate: Date,
  endDate: Date,
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
  data: Partial<MoneyReceiptInput>,
) => {
  await bumpCacheVersion("moneyreceipt"); // ✅ Fixed: "moneyReceipt" (was "MoneyReceipt")
  return prisma.moneyReceipt.update({
    where: { id },
    data,
  });
};

export const deleteMoneyReceipt = async (id: number) => {
  await bumpCacheVersion("moneyreceipt"); // ✅ Fixed: "moneyReceipt" (was "MoneyReceipt")
  return prisma.moneyReceipt.delete({ where: { id } });
};

// ✅ Fixed: tableName "moneyReceipt" to match Prisma model
export const searchMoneyReceipts = createSearchService(prisma, {
  tableName: "moneyReceipt", // ✅ Fixed: was "MoneyReceipt"
  exactFields: ["admissionNo"],
  prefixFields: ["admissionNo", "patientName"],
  similarFields: ["patientName", "mobile"],
  // selectFields: [
  //   "id",
  //   "admissionNo",
  //   "patientName",
  //   "mobile",
  //   "amount",
  //   "paymentMode",
  //   "date",
  //   "status",
  //   "createdAt",
  // ],
});

type FilterMoneyReceiptParams = {
  fromDate?: Date;
  toDate?: Date;
  paymentMode?: string;
  status?: string;
  cursor?: string;
  limit?: number;
};

export const filterMoneyReceiptsService = async (
  params: FilterMoneyReceiptParams,
) => {
  const { fromDate, toDate, paymentMode, status, cursor, limit } = params;

  const where: Record<string, any> = {};

  // ✅ Payment Mode filter
  if (paymentMode) {
    where.paymentMode = {
      equals: paymentMode,
      mode: "insensitive",
    };
  }

  // ✅ Status filter
  if (status) {
    where.status = {
      equals: status,
      mode: "insensitive",
    };
  }

  // ✅ Date range filter (using 'date' field instead of 'createdAt')
  if (fromDate || toDate) {
    where.date = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "moneyReceipt", // ✅ "moneyReceipt"
      limit,
    },
    cursor,
    where,
  );
};
