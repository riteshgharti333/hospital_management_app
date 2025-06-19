import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type AdmissionInput = {
  admissionDate: Date;
  admissionTime: string;
  dischargeDate?: Date;
  gsRsRegNo: string;
  wardNo: string;
  bedNo: string;
  bloodGroup: string;
  aadhaarNo: string;
  urnNo?: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  guardianType: string;
  guardianName: string;
  phoneNo: string;
  patientAddress: string;
  bodyWeightKg: number;
  bodyHeightCm: number;
  literacy: string;
  occupation: string;
  doctorName: string;
  isDelivery?: boolean;
};

export const createAdmission = async (data: AdmissionInput) => {
  return prisma.admission.create({ data });
};

export const getAllAdmissions = async () => {
  return prisma.admission.findMany({ orderBy: { createdAt: 'desc' } });
};

export const getAdmissionById = async (id: number) => {
  return prisma.admission.findUnique({ where: { id } });
};

export const updateAdmission = async (
  id: number,
  data: Partial<AdmissionInput>
) => {
  return prisma.admission.update({
    where: { id },
    data,
  });
};

export const deleteAdmission = async (id: number) => {
  return prisma.admission.delete({ where: { id } });
};
