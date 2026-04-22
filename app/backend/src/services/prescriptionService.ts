import { prisma } from "../lib/prisma";
import { bumpCacheVersion } from "../utils/cacheVersion";
import { filterPaginate } from "../utils/filterPaginate";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";
import { Prisma } from "@prisma/client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../aws/s3.client";

export type PrescriptionInput = {
  admissionId: number;
  prescriptionDate?: Date | string;
  prescriptionDoc?: string;
  notes?: string;
  status?: "ACTIVE" | "COMPLETED" | "CANCELLED";
  medicines: MedicineInput[];
};

export type MedicineInput = {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
};

// Helper to extract S3 key from URL
const extractS3KeyFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // Remove leading slash
  } catch {
    return null;
  }
};

// Helper to delete file from S3
const deleteFileFromS3 = async (fileUrl: string | null | undefined) => {
  if (!fileUrl) return;

  const key = extractS3KeyFromUrl(fileUrl);
  if (!key) return;

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("Failed to delete file from S3:", error);
  }
};

const generatePrescriptionNo = async (): Promise<string> => {
  const year = new Date().getFullYear();

  // Get the HIGHEST number ever created, not just the last one
  const allPrescriptions = await prisma.prescription.findMany({
    where: {
      prescriptionNo: {
        startsWith: `PRESC-${year}-`,
      },
    },
    select: {
      prescriptionNo: true,
    },
  });

  let maxNumber = 0;
  allPrescriptions.forEach((p) => {
    const parts = p.prescriptionNo.split("-");
    const num = parseInt(parts[parts.length - 1]);
    if (num > maxNumber) maxNumber = num;
  });

  const nextNumber = maxNumber + 1;
  return `PRESC-${year}-${nextNumber}`;
};

export const createPrescription = async (data: PrescriptionInput) => {
  const { medicines, ...prescriptionData } = data;
  const prescriptionNo = await generatePrescriptionNo();

  const prescription = await prisma.prescription.create({
    data: {
      ...prescriptionData,
      prescriptionNo,
      prescriptionDate: prescriptionData.prescriptionDate
        ? new Date(prescriptionData.prescriptionDate)
        : undefined,
      medicines: {
        create: medicines,
      },
    },
    include: {
      medicines: true,
      admission: {
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              hospitalPatientId: true,
            },
          },
        },
      },
    },
  });

  await bumpCacheVersion("prescription");
  return prescription;
};

export const getPrescriptionByNo = async (prescriptionNo: string) => {
  return prisma.prescription.findUnique({
    where: { prescriptionNo },
    include: {
      medicines: true,
      admission: {
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              hospitalPatientId: true,
            },
          },
        },
      },
    },
  });
};

export const getAllPrescriptions = async (cursor?: string) => {
  return cursorPaginate(
    prisma,
    {
      model: "prescription",
      include: {
        medicines: true,
        admission: {
          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                hospitalPatientId: true,
              },
            },
          },
        },
      },
    },
    cursor,
  );
};

export const getPrescriptionById = async (id: number) => {
  return prisma.prescription.findUnique({
    where: { id },
    include: {
      medicines: true,
      admission: {
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              hospitalPatientId: true,
              mobileNumber: true,
            },
          },
           doctor: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      },
    },
  });
};

export const updatePrescription = async (
  id: number,
  data: Partial<PrescriptionInput>,
) => {
  const { medicines, ...prescriptionData } = data;

  // Get existing prescription to check for old file
  const existingPrescription = await prisma.prescription.findUnique({
    where: { id },
    select: { prescriptionDoc: true },
  });

  // If updating prescriptionDoc and old one exists, delete old file from S3
  if (
    prescriptionData.prescriptionDoc &&
    existingPrescription?.prescriptionDoc
  ) {
    // Only delete if the URL is different
    if (
      prescriptionData.prescriptionDoc !== existingPrescription.prescriptionDoc
    ) {
      await deleteFileFromS3(existingPrescription.prescriptionDoc);
    }
  }

  const updateData: Prisma.PrescriptionUpdateInput = {
    ...prescriptionData,
    prescriptionDate: prescriptionData.prescriptionDate
      ? new Date(prescriptionData.prescriptionDate)
      : undefined,
  };

  // If medicines are provided, handle them separately
  if (medicines) {
    await prisma.medicine.deleteMany({
      where: { prescriptionId: id },
    });

    updateData.medicines = {
      create: medicines,
    };
  }

  const prescription = await prisma.prescription.update({
    where: { id },
    data: updateData,
    include: {
      medicines: true,
      admission: {
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              hospitalPatientId: true,
            },
          },
        },
      },
    },
  });

  await bumpCacheVersion("prescription");

  return prescription;
};

export const deletePrescription = async (id: number) => {
  // Get prescription to find associated file
  const prescription = await prisma.prescription.findUnique({
    where: { id },
    select: { prescriptionDoc: true },
  });

  // Delete file from S3 if exists
  if (prescription?.prescriptionDoc) {
    await deleteFileFromS3(prescription.prescriptionDoc);
  }

  // Delete prescription from database (cascades to medicines)
  const deletedPrescription = await prisma.prescription.delete({
    where: { id },
    include: {
      medicines: true,
    },
  });

  await bumpCacheVersion("prescription");

  return deletedPrescription;
};

export const searchPrescription = createSearchService(prisma, {
  tableName: "Prescription",
  exactFields: ["prescriptionNo"],
  prefixFields: ["prescriptionNo"],
  similarFields: [],
  selectFields: [
    "id",
    "prescriptionNo",
    "admissionId",
    "prescriptionDate",
    "prescriptionDoc",
    "notes",
    "status",
    "createdAt",
    "updatedAt",
  ],
});

type FilterPrescriptionParams = {
  fromDate?: Date;
  toDate?: Date;
  status?: "ACTIVE" | "COMPLETED" | "CANCELLED";
  admissionId?: number;
  cursor?: string;
  limit?: number;
};

export const filterPrescriptionsService = async (
  params: FilterPrescriptionParams,
) => {
  const { fromDate, toDate, status, admissionId, cursor, limit } = params;

  const where: Record<string, any> = {};

  if (status) {
    where.status = {
      equals: status,
    };
  }

  if (admissionId) {
    where.admissionId = admissionId;
  }

  if (fromDate || toDate) {
    where.prescriptionDate = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "prescription",
      limit,
      include: {
        medicines: true,
        admission: {
          include: {
            patient: {
              select: {
                id: true,
                fullName: true,
                hospitalPatientId: true,
              },
            },
          },
        },
      },
    },
    cursor,
    where,
  );
};

export const getPrescriptionsByAdmission = async (admissionId: number) => {
  return prisma.prescription.findMany({
    where: { admissionId },
    include: {
      medicines: true,
    },
    orderBy: {
      prescriptionDate: "desc",
    },
  });
};
