import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type BedAssignmentInput = {
  wardNumber: string;
  bedNumber: string;
  bedType: string;
  notes?: string;
  patientName: string;
  allocateDate: Date;
  dischargeDate?: Date;
  status?: string;
};

export const createBedAssignment = async (data: BedAssignmentInput) => {
  return prisma.bedAssignment.create({ data });
};

export const getAllBedAssignments = async () => {
  return prisma.bedAssignment.findMany({ orderBy: { allocateDate: "desc" } });
};

export const getBedAssignmentById = async (id: number) => {
  return prisma.bedAssignment.findUnique({ where: { id } });
};

export const getAssignmentsByBed = async (bedNumber: string) => {
  return prisma.bedAssignment.findMany({
    where: { bedNumber },
    orderBy: { allocateDate: "desc" },
  });
};

export const getAssignmentsByWard = async (wardNumber: string) => {
  return prisma.bedAssignment.findMany({
    where: { wardNumber },
    orderBy: { allocateDate: "desc" },
  });
};

export const getActiveAssignments = async () => {
  return prisma.bedAssignment.findMany({
    where: { status: "Active" },
    orderBy: { allocateDate: "desc" },
  });
};

export const updateBedAssignment = async (
  id: number,
  data: Partial<BedAssignmentInput>
) => {
  return prisma.bedAssignment.update({
    where: { id },
    data,
  });
};

export const dischargePatient = async (id: number, dischargeDate: Date) => {
  return prisma.bedAssignment.update({
    where: { id },
    data: {
      status: "Discharged",
      dischargeDate,
    },
  });
};

export const deleteBedAssignment = async (id: number) => {
  return prisma.bedAssignment.delete({ where: { id } });
};
