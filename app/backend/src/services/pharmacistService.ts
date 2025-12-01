import { Pharmacist } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { createSearchService } from "../utils/searchCache";
import { applyCommonFields } from "../utils/applyCommonFields";

export type CreatePharmacistInput = {
  fullName: string;
  mobileNumber: string;
  registrationNo: string;
  address: string;
  department: string;
  status?: string;
};

export type UpdatePharmacistInput = Partial<CreatePharmacistInput>;

export const createPharmacist = async (
  data: CreatePharmacistInput
): Promise<Pharmacist> => {
  // Check for duplicate registration number
  const existing = await prisma.pharmacist.findUnique({
    where: { registrationNo: data.registrationNo },
  });

  if (existing) {
    throw new Error("Pharmacist with this registration number already exists");
  }
 
  return prisma.pharmacist.create({
    data: {
      ...data,
      status: data.status ?? "Active", // Default status
    },
  });
};

export const getAllPharmacists = async (): Promise<Pharmacist[]> => {
  return prisma.pharmacist.findMany({
    orderBy: { createdAt: "desc" },
  }); 
};

export const getPharmacistById = async (
  id: number
): Promise<Pharmacist | null> => {
  return prisma.pharmacist.findUnique({ 
    where: { id },
  });
};

export const getPharmacistByRegistration = async (
  registrationNo: string
): Promise<Pharmacist | null> => {
  return prisma.pharmacist.findUnique({
    where: { registrationNo },
  });
};

export const getPharmacistsByDepartment = async (
  department: string
): Promise<Pharmacist[]> => {
  return prisma.pharmacist.findMany({
    where: { department },
    orderBy: { fullName: "asc" },
  });
};

export const updatePharmacist = async (
  id: number,
  data: UpdatePharmacistInput
): Promise<Pharmacist> => {
  // Prevent duplicate registration numbers on update
  if (data.registrationNo) {
    const existing = await prisma.pharmacist.findFirst({
      where: {
        registrationNo: data.registrationNo,
        NOT: { id },
      },
    });

    if (existing) {
      throw new Error(
        "Another pharmacist with this registration number already exists"
      );
    }
  }
 
  return prisma.pharmacist.update({
    where: { id },
    data,
  });
};

export const deletePharmacist = async (id: number): Promise<Pharmacist> => {
  return prisma.pharmacist.delete({
    where: { id },
  });
};

const commonSearchFields = ["fullName", "mobileNumber", "registrationNo"];

export const searchPharmacist = createSearchService(prisma, {
  tableName: "Pharmacist",
  cacheKeyPrefix: "pharmacist",
  ...applyCommonFields(commonSearchFields),
});
