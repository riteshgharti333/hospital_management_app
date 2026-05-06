import { prisma } from "../../lib/prisma";

import { filterPaginate } from "../../utils/filterPaginate";
import { cursorPaginate } from "../../utils/pagination";
import { createSearchService } from "../../utils/searchCache";
import { bumpCacheVersion } from "../../utils/cacheVersion";

export type BillItemInput = {
  company: string;
  itemOrService: string;
  quantity: number;
  mrp: number;
  totalAmount?: number;
};

export type BillInput = {
  billDate: Date;
  billType: string;
  admissionId: number;
  patientId: number;
  totalAmount: number;
  status: string;
  billItems: BillItemInput[];
};

export const createBill = async (data: BillInput) => {
  // Calculate each item's totalAmount (qty × mrp)
  const processedItems = data.billItems.map((item) => ({
    company: item.company,
    itemOrService: item.itemOrService,
    quantity: item.quantity,
    mrp: item.mrp,
    totalAmount: item.totalAmount ?? item.mrp * item.quantity,
  }));

  // Calculate full bill total (sum of all items)
  const billTotalAmount = processedItems.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0,
  );

  await bumpCacheVersion("bill");

  // Create bill with Prisma
  const billData = {
    billDate: new Date(data.billDate),
    billType: data.billType,
    admissionId: data.admissionId,
    patientId: data.patientId,
    totalAmount: billTotalAmount,
    status: data.status,
    billItems: {
      create: processedItems,
    },
  };

  await bumpCacheVersion("bill");

  return prisma.bill.create({
    data: billData,
    include: { billItems: true },
  });
};

export const getAllBillsService = async (cursor?: string) => {
  return cursorPaginate(
    prisma,
    {
      model: "bill",
      include: {
        admission: true,
        patient: true,
      },
    },
    cursor,
  );
};

export const getBillById = async (id: number) => {
  return prisma.bill.findUnique({
    where: { id },
    include: {
      billItems: true,
      admission: true,
      patient: true,
    },
  });
};

export const updateBill = async (id: number, data: Partial<BillInput>) => {
  const processedItems =
    data.billItems?.map((item) => {
      const total = item.totalAmount ?? item.mrp * item.quantity;
      return {
        ...item,
        totalAmount: total,
      };
    }) || [];

  const grandTotal = processedItems.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0,
  );

  await bumpCacheVersion("bill");

  return prisma.bill.update({
    where: { id },
    data: {
      billDate: data.billDate,
      billType: data.billType,
      status: data.status,
      admissionId: data.admissionId,
      patientId: data.patientId,

      totalAmount: grandTotal, // ⭐ SAVE BILL TOTAL

      billItems: {
        deleteMany: {}, // Remove all old items
        create: processedItems.map((item) => ({
          company: item.company,
          itemOrService: item.itemOrService,
          quantity: item.quantity,
          mrp: item.mrp,
          totalAmount: item.totalAmount,
        })),
      },
    },
    include: { billItems: true },
  });
};

export const deleteBill = async (id: number) => {
  await bumpCacheVersion("bill");
  return prisma.bill.delete({
    where: { id },
    include: { billItems: true },
  });
};

export const searchBills = createSearchService(prisma, {
  tableName: "Bill",
  exactFields: [],
  prefixFields: [],
  similarFields: [],
  relationFields: {
    patient: ["fullName", "hospitalPatientId", "mobileNumber"],
  },

  include: {
    admission: true,
    patient: true,
  },
});

type FilterBillParams = {
  fromDate?: Date;
  toDate?: Date;
  billType?: string;
  patientSex?: string;
  status?: string;
  cursor?: string;
};

export const filterBillsService = async (params: FilterBillParams) => {
  const { fromDate, toDate, billType, patientSex, status, cursor } = params;

  const where: Record<string, any> = {};

  // ✅ Bill Type filter
  if (billType) {
    where.billType = {
      equals: billType,
      mode: "insensitive",
    };
  }

  // ✅ Patient Sex filter
  if (patientSex) {
    where.patientSex = {
      equals: patientSex,
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

  // ✅ Date range filter (using 'billDate' field)
  if (fromDate || toDate) {
    where.billDate = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "bill",

      include: {
        admission: true,
        patient: true,
      },
    },
    cursor,
    where,
  );
};
