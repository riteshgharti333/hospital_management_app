import { prisma } from "../../lib/prisma";

export type ProductInput = {
  brand: string;
  category: string;
  productName: string;
  shortDescription?: string;
  hsnCode: string;
  gstPercentage: string;
  status?: string;
  specifications?: MaterialSpecificationInput[];
};

export type MaterialSpecificationInput = {
  uom: string;
  description?: string;
  alterUnit?: string;
  alterUnitValue?: number;
  serialUniqueNo?: string;
};

export type ProductUpdateInput = Partial<Omit<ProductInput, 'specifications'>> & {
  specifications?: {
    create?: MaterialSpecificationInput[];
    update?: {
      where: { id: number };
      data: MaterialSpecificationInput;
    }[];
    delete?: { id: number }[];
  };
};


export const createProduct = async (data: ProductInput) => {
  const createData = {
    ...data,
    specifications: data.specifications 
      ? { create: data.specifications }
      : undefined
  };

  return prisma.productEntery.create({
    data: createData,
    include: { specifications: true },
  });
};

export const getAllProducts = async () => {
  return prisma.productEntery.findMany({
    orderBy: { createdAt: "desc" },
    include: { specifications: true },
  });
};

export const getProductById = async (id: number) => {
  return prisma.productEntery.findUnique({
    where: { id },
    include: { specifications: true },
  });
};

export const getProductsByCategory = async (category: string) => {
  return prisma.productEntery.findMany({
    where: { category },
    orderBy: { productName: "asc" },
    include: { specifications: true },
  });
};

export const updateProduct = async (id: number, data: ProductUpdateInput) => {
  return prisma.productEntery.update({
    where: { id },
    data: {
      ...data,
      specifications: data.specifications,
    },
    include: { specifications: true },
  });
};

export const deleteProduct = async (id: number) => {
  return prisma.productEntery.delete({
    where: { id },
    include: { specifications: true },
  });
};
