import { prisma } from "../lib/prisma";
import { cursorPaginate } from "../utils/pagination";
import { filterPaginate } from "../utils/filterPaginate";
import { createSearchService } from "../utils/searchCache";
import { bumpCacheVersion } from "../utils/cacheVersion";
import { AmountType, PaymentMode } from "@prisma/client";

export type LedgerInput = {
  entityType: string;
  entityId: number;
  transactionDate: Date;
  description: string;
  amountType: AmountType;
  amount: number;
  paymentMode?: PaymentMode;
  referenceType?: string;
  referenceId?: string;
  remarks?: string;
};

export const generateLedgerCode = async (): Promise<string> => {
  const lastLedger = await prisma.ledger.findFirst({
    orderBy: { id: "desc" },
  });

  const nextNumber = lastLedger ? lastLedger.id + 1 : 1;
  return `HMS-LED-${nextNumber}`;
};

export const calculateBalance = async (
  entityType: string,
  entityId: number,
  amountType: AmountType,
  amount: number,
): Promise<number> => {
  const lastTransaction = await prisma.ledger.findFirst({
    where: {
      entityType,
      entityId,
    },
    orderBy: {
      transactionDate: "desc",
    },
  });

  const currentBalance = lastTransaction?.balance || 0;

  if (amountType === "CREDIT") {
    return Number(currentBalance) + amount;
  } else {
    return Number(currentBalance) - amount;
  }
};

export const createLedger = async (data: LedgerInput) => {
  const code = await generateLedgerCode();
  const balance = await calculateBalance(
    data.entityType,
    data.entityId,
    data.amountType,
    data.amount,
  );

  const result = await prisma.ledger.create({
    data: {
      ...data,
      code,
      balance,
    },
  });

  await bumpCacheVersion("ledger");

  return result;
};

export const getLedgerByCode = async (code: string) => {
  return prisma.ledger.findUnique({ where: { code } });
};

export const getAllLedgers = async (cursor?: string) => {
  return cursorPaginate(prisma, { model: "ledger" }, cursor);
};

export const getLedgerById = async (id: number) => {
  return prisma.ledger.findUnique({ where: { id } });
};

export const getLedgersByEntity = async (entityType: string) => {
  return prisma.ledger.findMany({
    where: {
      entityType,
    },
    orderBy: {
      transactionDate: "desc",
    },
  });
};

export const getCurrentBalance = async (
  entityType: string,
  entityId: number,
) => {
  const lastTransaction = await prisma.ledger.findFirst({
    where: {
      entityType,
      entityId,
    },
    orderBy: {
      transactionDate: "desc",
    },
    select: {
      balance: true,
    },
  });

  return lastTransaction?.balance || 0;
};

export const updateLedger = async (id: number, data: Partial<LedgerInput>) => {
  // Note: Updating ledger transactions might affect subsequent balances
  // This is a simple update - you may need to recalculate subsequent balances
  const result = await prisma.ledger.update({
    where: { id },
    data,
  });

  await bumpCacheVersion("ledger");

  return result;
};

export const deleteLedger = async (id: number) => {
  const result = await prisma.ledger.delete({
    where: { id },
  });

  await bumpCacheVersion("ledger");

  return result;
};

export const searchLedger = createSearchService(prisma, {
  tableName: "Ledger",
  exactFields: ["code", "description", "referenceId"],
  prefixFields: ["description", "remarks"],
  similarFields: ["description"],
  selectFields: [
    "id",
    "code",
    "entityType",
    "entityId",
    "transactionDate",
    "description",
    "amountType",
    "amount",
    "balance",
    "paymentMode",
    "referenceType",
    "referenceId",
    "remarks",
    "createdAt",
    "updatedAt",
  ],
});

type FilterLedgerParams = {
  fromDate?: Date;
  toDate?: Date;
  entityType?: string;
  entityId?: number;
  amountType?: AmountType;
  paymentMode?: PaymentMode;
  cursor?: string;
  limit?: number;
};

export const filterLedgersService = async (params: FilterLedgerParams) => {
  const {
    fromDate,
    toDate,
    entityType,
    entityId,
    amountType,
    paymentMode,
    cursor,
    limit,
  } = params;

  const where: Record<string, any> = {};

  // Entity filter
  if (entityType) {
    where.entityType = entityType;
  }

  if (entityId) {
    where.entityId = entityId;
  }

  // Amount type filter
  if (amountType) {
    where.amountType = amountType;
  }

  // Payment mode filter
  if (paymentMode) {
    where.paymentMode = paymentMode;
  }

  // Date range filter
  if (fromDate || toDate) {
    where.transactionDate = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "ledger",
      limit,
      select: {
        id: true,
        code: true,
        entityType: true,
        entityId: true,
        transactionDate: true,
        description: true,
        amountType: true,
        amount: true,
        balance: true,
        paymentMode: true,
        referenceType: true,
        referenceId: true,
        remarks: true,
        createdAt: true,
        updatedAt: true,
      },
    },
    cursor,
    where,
  );
};
