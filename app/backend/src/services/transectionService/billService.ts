import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  admissionDate: Date;
  dateOfBirth: Date;
  gender: string;
  dischargeDate?: Date;
  address: string;
  doctorName: string;
  wardNo: string;
  bedNo: string;
  status?: string;
  billItems: BillItemInput[];
};

export const createBill = async (data: BillInput) => {
  return prisma.bill.create({
    data: {
      ...data,
      billItems: {
        create: data.billItems,
      },
    },
    include: { billItems: true },
  });
};

export const getAllBills = async () => {
  return prisma.bill.findMany({
    orderBy: { createdAt: "desc" },
    include: { billItems: true },
  });
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

export const updateBill = async (
  id: number,
  data: Partial<Omit<BillInput, "billItems">> & {
    billItems?: {
      create?: BillItemInput[];
      update?: {
        where: { id: number };
        data: BillItemInput;
      }[];
      delete?: { id: number }[];
    };
  }
) => {
  const { billItems, ...rest } = data;

  const formattedUpdate = {
    ...(billItems?.create
      ? {
          create: billItems.create.map((item) => ({
            ...item,
            totalAmount: item.mrp * item.quantity,
          })),
        }
      : {}),

    ...(billItems?.update
      ? {
          update: billItems.update.map((updateItem) => ({
            where: updateItem.where,
            data: {
              ...updateItem.data,
              totalAmount: updateItem.data.mrp * updateItem.data.quantity,
            },
          })),
        }
      : {}),

    ...(billItems?.delete
      ? {
          deleteMany: billItems.delete,
        }
      : {}),
  };

  return prisma.bill.update({
    where: { id },
    data: {
      ...rest,
      ...(billItems && {
        billItems: formattedUpdate,
      }),
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
