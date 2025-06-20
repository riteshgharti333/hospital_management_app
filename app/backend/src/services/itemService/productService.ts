import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Matches your Prisma Product model
export type ProductInput = {
  productName: string;
  productCode: string;
  parentCategory: string;
  subCategory: string;
  categoryLogo?: string;
  description?: string;
  unit: string;
  price: number;
  taxRate: number;
  status?: string;
};

export type ProductUpdateInput = Partial<ProductInput>;

// ✅ Create Product
export const createProduct = async (data: ProductInput) => {
  return prisma.product.create({
    data: {
      ...data,
      status: data.status ?? "Active", // default fallback
    },
  });
};

// ✅ Get All Products
export const getAllProducts = async () => {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// ✅ Get Product by ID
export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

// ✅ Get Products by Category (Parent + Subcategory)
export const getProductsByCategory = async (
  parentCategory: string,
  subCategory?: string
) => {
  return prisma.product.findMany({
    where: {
      parentCategory,
      ...(subCategory && { subCategory }),
    },
    orderBy: { productName: "asc" },
  });
};

// ✅ Update Product
export const updateProduct = async (id: number, data: ProductUpdateInput) => {
  return prisma.product.update({
    where: { id },
    data,
  });
};

// ✅ Delete Product
export const deleteProduct = async (id: number) => {
  return prisma.product.delete({
    where: { id },
  });
};
