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

type PatientLedgerCreateInput = {
  patientName: string;
  transactionDate: Date;
  description: string;
  amountType: AmountType;
  amount: number;
  paymentMode: PaymentMode;
  transactionId?: string;
  remarks?: string;
};

type PatientLedgerUpdateInput = Partial<PatientLedgerCreateInput>;

export const createLedgerEntry = async (
  data: PatientLedgerCreateInput
) => {
  return prisma.patientLedger.create({ data });
};

export const getAllPatientLedgerService = async (
  cursor?: string,
  limit?: number
) => {
  return cursorPaginate(
    prisma,
    {
      model: "patientLedger",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getLedgerEntryById = async (id: number) => {
  return prisma.patientLedger.findUnique({ where: { id } });
};

export const getPatientBalance = async (patientName: string) => {
  const entries = await prisma.patientLedger.findMany({
    where: { patientName },
    select: { amountType: true, amount: true },
  });

  return entries.reduce((balance, entry) => {
    const amount = entry.amount.toNumber();
    return entry.amountType === "CREDIT"
      ? balance + amount
      : balance - amount;
  }, 0);
};

export const updateLedgerEntry = async (
  id: number,
  data: PatientLedgerUpdateInput
) => {
  return prisma.patientLedger.update({
    where: { id },
    data,
  });
};

export const deleteLedgerEntry = async (id: number) => {
  return prisma.patientLedger.delete({ where: { id } });
};

const commonSearchFields = ["patientName"];

export const searchPatientLedger = createSearchService(prisma, {
  tableName: "PatientLedger",
  cacheKeyPrefix: "patient-ledger",
  ...applyCommonFields(commonSearchFields),
});

export const filterPatientLedgerService = async (filters: {
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
      model: "patientLedger",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
