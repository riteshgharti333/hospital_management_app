import { prisma } from "../../lib/prisma";
import { applyCommonFields } from "../../utils/applyCommonFields";
import { filterPaginate } from "../../utils/filterPaginate";
import { cursorPaginate } from "../../utils/pagination";
import { createSearchService } from "../../utils/searchCache";

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

export const getAllDoctorLedgerService = async (
  cursor?: string,
  limit?: number
) => {
  return cursorPaginate(
    prisma,
    {
      model: "doctorLedger",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
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


const commonSearchFields = ["doctorName"];

export const searchDoctorLedger = createSearchService(prisma, {
  tableName: "DoctorLedger",
  cacheKeyPrefix: "doctor-ledger",
  ...applyCommonFields(commonSearchFields),
});


export const filterDoctorLedgerService = async (filters: {
  amountType?: string;
  paymentMode?: string;
  fromDate?: Date;
  toDate?: Date;
  cursor?: string | number;
  limit?: number;
}) => {
  const { amountType, paymentMode, fromDate, toDate, cursor, limit } = filters;

  const filterObj: any = {};

  if (amountType)
    filterObj.amountType = { equals: amountType, mode: "insensitive" };

  if (paymentMode)
    filterObj.paymentMode = { equals: paymentMode, mode: "insensitive" };

  if (fromDate || toDate) {
    filterObj.date = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "doctorLedger",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
