import { prisma } from "../../lib/prisma";
import { applyCommonFields } from "../../utils/applyCommonFields";

import { filterPaginate } from "../../utils/filterPaginate";
import { cursorPaginate } from "../../utils/pagination";
import { createSearchService } from "../../utils/searchCache";

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
  mobile: string;
  admissionNo: string;
  patientName: string;
  admissionDate: Date;
  totalAmount: number;
  patientSex: string;
  patientAge: number;
  dischargeDate?: Date | null;
  address: string;
  status: string;
  billItems: BillItemInput[];
};

export const createBill = async (data: BillInput) => {
  // Calculate each item's totalAmount (qty × mrp)
  const processedItems = data.billItems.map((item) => ({
    ...item,
    totalAmount: item.totalAmount ?? item.mrp * item.quantity,
  }));

  // Calculate full bill total (sum of all items)
  const billTotalAmount = processedItems.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );

  return prisma.bill.create({
    data: {
      ...data,
      totalAmount: billTotalAmount,
      billItems: {
        create: processedItems,
      },
    },
    include: { billItems: true },
  });
};

export const getAllBillsService = async (cursor?: string, limit?: number) => {
  return cursorPaginate(
    prisma,
    {
      model: "bill",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getBillById = async (id: number) => {
  return prisma.bill.findUnique({
    where: { id },
    include: { billItems: true },
  });
};

export const getBillsByPatient = async (mobile: string) => {
  return prisma.bill.findMany({
    where: { mobile },
    orderBy: { billDate: "desc" },
    include: { billItems: true },
  });
};

export const updateBill = async (id: number, data: Partial<BillInput>) => {
  // ⭐ Calculate each item's totalAmount
  const processedItems =
    data.billItems?.map((item) => {
      const total = item.totalAmount ?? item.mrp * item.quantity;
      return {
        ...item,
        totalAmount: total,
      };
    }) || [];

  // ⭐ Calculate totalAmount for the entire bill
  const grandTotal = processedItems.reduce(
    (sum, item) => sum + (item.totalAmount || 0),
    0
  );

  return prisma.bill.update({
    where: { id },
    data: {
      billDate: data.billDate,
      billType: data.billType,
      status: data.status,
      mobile: data.mobile,
      admissionNo: data.admissionNo,
      patientName: data.patientName,
      admissionDate: data.admissionDate,
      patientAge: data.patientAge,
      patientSex: data.patientSex,
      dischargeDate: data.dischargeDate ?? null,
      address: data.address,
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
  return prisma.bill.delete({
    where: { id },
    include: { billItems: true },
  });
};

const billSearchFields = ["admissionNo", "patientName", "mobile"];

export const searchBills = createSearchService(prisma, {
  tableName: "Bill",
  cacheKeyPrefix: "bill",
  ...applyCommonFields(billSearchFields),
});

export const filterBillsService = async (filters: {
  fromDate?: Date;
  toDate?: Date;
  billType?: string;
  patientSex?: string;
  status?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, billType, patientSex, status, cursor, limit } =
    filters;

  const filterObj: Record<string, any> = {};

  if (billType) filterObj.billType = billType;
  if (patientSex) filterObj.patientSex = patientSex;
  if (status) filterObj.status = status;

  if (fromDate || toDate)
    filterObj.billDate = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };

  return filterPaginate(
    prisma,
    {
      model: "bill",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};

