import { prisma } from "../lib/prisma";
import { cursorPaginate } from "../utils/pagination";
import { filterPaginate } from "../utils/filterPaginate";
import { createSearchService } from "../utils/searchCache";
import { bumpCacheVersion } from "../utils/cacheVersion";
import { AmountType, PaymentMode } from "@prisma/client";

export type LedgerInput = {
  entityType: string;
  entityId: string;
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
  entityId: string,
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
  entityId: string,
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
  exactFields: ["code", "entityId"],  // Only search by code and entityId
  prefixFields: [],  // Remove prefix fields
  similarFields: [],  // Remove similar fields
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
  amountType?: AmountType;
  paymentMode?: PaymentMode;
  cursor?: string;
  limit?: number;
};

export const filterLedgersService = async (
  params: FilterLedgerParams,
  forcedEntityType?: string
) => {
  const {
    fromDate,
    toDate,
    entityType: paramEntityType,
    amountType,
    paymentMode,
    cursor,
    limit,
  } = params;

  const where: Record<string, any> = {};

  // Entity filter - prioritize forcedEntityType from path over query param
  const effectiveEntityType = forcedEntityType || paramEntityType;
  
  if (effectiveEntityType) {
    where.entityType = effectiveEntityType;
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
    where.transactionDate = {};
    
    if (fromDate) {
      // Set to start of day (00:00:00)
      const startDate = new Date(fromDate);
      startDate.setHours(0, 0, 0, 0);
      where.transactionDate.gte = startDate;
    }
    
    if (toDate) {
      // Set to end of day (23:59:59)
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
      where.transactionDate.lte = endDate;
    }
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
      orderBy: {
        transactionDate: 'desc',
      },
    },
    cursor,
    where,
  );
};