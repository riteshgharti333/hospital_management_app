import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type MedicineInput = {
  medicineName: string;
  description: string;
};

type PrescriptionInput = {
  prescriptionDate: Date;
  doctorId: number;
  patientId: number;
  prescriptionDoc?: string;
  status?: string;
  medicines: MedicineInput[];
};

type PrescriptionUpdateInput = Partial<Omit<PrescriptionInput, "medicines">> & {
  medicines?: MedicineInput[];
};

export const createPrescription = async (data: PrescriptionInput) => {
  return prisma.prescription.create({
    data: {
      ...data,
      medicines: {
        create: data.medicines,
      },
    },
    include: {
      medicines: true,
      doctor: true,
      patient: true,
    },
  });
};

export const getAllPrescriptions = async () => {
  return prisma.prescription.findMany({
    orderBy: { prescriptionDate: "desc" },
    include: {
      medicines: true,
      doctor: true,
      patient: true,
    },
  });
};

export const getPrescriptionById = async (id: number) => {
  return prisma.prescription.findUnique({
    where: { id },
    include: {
      medicines: true,
      doctor: true,
      patient: true,
    },
  });
};

export const getPrescriptionsByPatient = async (patientId: number) => {
  return prisma.prescription.findMany({
    where: { patientId },
    orderBy: { prescriptionDate: "desc" },
    include: {
      medicines: true,
      doctor: true,
    },
  });
};

export const updatePrescription = async (
  id: number,
  data: PrescriptionUpdateInput
) => {
  const updatedPrescription = await prisma.prescription.update({
    where: { id },
    data: {
      prescriptionDate: data.prescriptionDate,
      doctorId: data.doctorId,
      patientId: data.patientId,
      prescriptionDoc: data.prescriptionDoc,
      status: data.status,
    },
    include: {
      medicines: true,
    },
  });

  if (data.medicines) {
    await prisma.medicine.deleteMany({ where: { prescriptionId: id } });
    await prisma.medicine.createMany({
      data: data.medicines.map((med) => ({
        ...med,
        prescriptionId: id,
      })),
    });
  }

  return prisma.prescription.findUnique({
    where: { id },
    include: {
      medicines: true,
      doctor: true,
      patient: true,
    },
  });
};

export const deletePrescription = async (id: number) => {
  await prisma.medicine.deleteMany({ where: { prescriptionId: id } });
  return prisma.prescription.delete({ where: { id } });
};
