import { prisma } from "../../lib/prisma";
import { applyCommonFields } from "../../utils/applyCommonFields";
import { filterPaginate } from "../../utils/filterPaginate";
import { cursorPaginate } from "../../utils/pagination";
import { createSearchService } from "../../utils/searchCache";

type AmountType = "CREDIT" | "DEBIT";

type PaymentMode =
  | "CASH"
  | "CARD"
  | "UPI"
  | "BANK_TRANSFER"
  | "CHEQUE";

type DoctorLedgerCreateInput = {
  doctorName: string;
  transactionDate: Date;
  description: string;
  amountType: AmountType;
  amount: number;
  paymentMode: PaymentMode;
  transactionId?: string;
  remarks?: string;
};

type DoctorLedgerUpdateInput = Partial<DoctorLedgerCreateInput>;

export const createDoctorLedgerEntry = async (
  data: DoctorLedgerCreateInput
) => {
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
    return entry.amountType === "CREDIT"
      ? balance + amount
      : balance - amount;
  }, 0);
};

export const updateDoctorLedgerEntry = async (
  id: number,
  data: DoctorLedgerUpdateInput
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
  amountType?: AmountType;
  paymentMode?: PaymentMode;
  fromDate?: Date;
  toDate?: Date;
  cursor?: string | number;
  limit?: number;
}) => {
  const { amountType, paymentMode, fromDate, toDate, cursor, limit } = filters;

  const filterObj: Record<string, any> = {};

  if (amountType) filterObj.amountType = amountType;
  if (paymentMode) filterObj.paymentMode = paymentMode;

  if (fromDate || toDate) {
    filterObj.transactionDate = {
      gte: fromDate,
      lte: toDate,
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
