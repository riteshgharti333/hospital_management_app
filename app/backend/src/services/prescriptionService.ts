import { prisma } from "../lib/prisma";

export type MedicineInput = {
  medicineName: string;
  description: string;
};

export type PrescriptionInput = {
  prescriptionDate: Date;
  doctorId: number;
  patientId: number;
  prescriptionDoc?: string | null;
  status?: string;
  medicines: MedicineInput[];
};

export type UpdatePrescriptionInput = Partial<Omit<PrescriptionInput, 'medicines'>> & {
  medicines?: MedicineInput[];
};

export const createPrescription = async (data: PrescriptionInput) => {
  return prisma.prescription.create({
    data: {
      ...data,
      prescriptionDoc: data.prescriptionDoc ?? null,
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
  data: UpdatePrescriptionInput
) => {
  // First update main prescription
  const updatedPrescription = await prisma.prescription.update({
    where: { id },
    data: {
      prescriptionDate: data.prescriptionDate,
      doctorId: data.doctorId,
      patientId: data.patientId,
      prescriptionDoc: data.prescriptionDoc ?? null,
      status: data.status,
    },
    include: {
      medicines: true,
    },
  });

  // Then handle medicines if provided
  if (data.medicines) {
    await prisma.$transaction([
      prisma.medicine.deleteMany({
        where: { prescriptionId: id },
      }),
      prisma.medicine.createMany({
        data: data.medicines.map((medicine) => ({
          ...medicine,
          prescriptionId: id,
        })),
      }),
    ]);
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
  await prisma.medicine.deleteMany({
    where: { prescriptionId: id },
  });

  return prisma.prescription.delete({
    where: { id },
  });
};
