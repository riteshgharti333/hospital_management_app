import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type AmbulanceInput = {
  modelName: string;
  brand: string;
  registrationNo: string;
  driverName: string;
  driverContact: string;
  status?: string;
};

export const createAmbulance = async (data: AmbulanceInput) => {
  return prisma.ambulance.create({ data });
};

export const getAllAmbulances = async (status?: string) => {
  const where = status ? { status } : {};
  return prisma.ambulance.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

export const getAmbulanceById = async (id: number) => {
  return prisma.ambulance.findUnique({ where: { id } });
};

export const getAmbulanceByRegistration = async (
  registrationNo: string
) => {
  return prisma.ambulance.findUnique({ where: { registrationNo } });
};

export const updateAmbulance = async (
  id: number,
  data: Partial<AmbulanceInput>
) => {
  return prisma.ambulance.update({ where: { id }, data });
};

export const deleteAmbulance = async (id: number) => {
  return prisma.ambulance.delete({ where: { id } });
};
