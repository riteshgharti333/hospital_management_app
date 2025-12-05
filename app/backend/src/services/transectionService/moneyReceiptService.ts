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
