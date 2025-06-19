import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPrescription = async (data: {
  prescriptionDate: Date;
  doctorId: number;
  patientId: number;
  prescriptionDoc?: string;
  status?: string;
  medicines: {
    medicineName: string;
    description: string;
  }[];
}) => {
  return prisma.prescription.create({
    data: {
      ...data,
      medicines: {
        create: data.medicines
      }
    },
    include: {
      medicines: true,
      doctor: true,
      patient: true
    }
  });
};

export const getAllPrescriptions = async () => {
  return prisma.prescription.findMany({
    orderBy: { prescriptionDate: "desc" },
    include: {
      medicines: true,
      doctor: true,
      patient: true
    }
  });
};

export const getPrescriptionById = async (id: number) => {
  return prisma.prescription.findUnique({
    where: { id },
    include: {
      medicines: true,
      doctor: true,
      patient: true
    }
  });
};

export const getPrescriptionsByPatient = async (patientId: number) => {
  return prisma.prescription.findMany({
    where: { patientId },
    orderBy: { prescriptionDate: "desc" },
    include: {
      medicines: true,
      doctor: true
    }
  });
};

export const updatePrescription = async (
  id: number,
  data: {
    prescriptionDate?: Date;
    doctorId?: number;
    patientId?: number;
    prescriptionDoc?: string;
    status?: string;
    medicines?: {
      medicineName: string;
      description: string;
    }[];
  }
) => {
  // First update prescription details
  const updatedPrescription = await prisma.prescription.update({
    where: { id },
    data: {
      prescriptionDate: data.prescriptionDate,
      doctorId: data.doctorId,
      patientId: data.patientId,
      prescriptionDoc: data.prescriptionDoc,
      status: data.status
    },
    include: {
      medicines: true
    }
  });

  // Then update medicines if provided
  if (data.medicines) {
    // Delete existing medicines
    await prisma.medicine.deleteMany({
      where: { prescriptionId: id }
    });

    // Create new medicines
    await prisma.medicine.createMany({
      data: data.medicines.map(medicine => ({
        ...medicine,
        prescriptionId: id
      }))
    });
  }

  return prisma.prescription.findUnique({
    where: { id },
    include: {
      medicines: true,
      doctor: true,
      patient: true
    }
  });
};

export const deletePrescription = async (id: number) => {
  // First delete all medicines
  await prisma.medicine.deleteMany({
    where: { prescriptionId: id }
  });

  // Then delete the prescription
  return prisma.prescription.delete({
    where: { id }
  });
};