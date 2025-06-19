import { PrismaClient, Brand } from "@prisma/client";
const prisma = new PrismaClient();

// Types
export type CreateBrandInput = {
  brandName: string;
  brandLogo: string;
  description: string;
  status?: string;
};

export type UpdateBrandInput = Partial<CreateBrandInput>;

// Create a new brand
export const createBrand = async (data: CreateBrandInput): Promise<Brand> => {
  return prisma.brand.create({ data });
};

// Get all brands (sorted latest first)
export const getAllBrands = async (): Promise<Brand[]> => {
  return prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// Get brand by ID
export const getBrandById = async (id: number): Promise<Brand | null> => {
  return prisma.brand.findUnique({ where: { id } });
};

// Get brand by Name
export const getBrandByName = async (brandName: string): Promise<Brand | null> => {
  return prisma.brand.findUnique({ where: { brandName } });
};

// Update a brand
export const updateBrand = async (
  id: number,
  data: UpdateBrandInput
): Promise<Brand> => {
  return prisma.brand.update({ where: { id }, data });
};

// Delete a brand
export const deleteBrand = async (id: number): Promise<Brand> => {
  return prisma.brand.delete({ where: { id } });
};
