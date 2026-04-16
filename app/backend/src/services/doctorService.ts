import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { cursorPaginate } from "../utils/pagination";
import { filterPaginate } from "../utils/filterPaginate";
import { createSearchService } from "../utils/searchCache";
import { generateRegistrationNumber } from "../utils/registrationGenerator";
import { bumpCacheVersion } from "../utils/cacheVersion";

export type DoctorInput = {
  fullName: string;
  mobileNumber: string;
  email: string;
  qualification: string;
  designation: string;
  department: string;
  specialization: string;
  status?: string;
};

export const createDoctor = async (data: DoctorInput) => {
  const registrationNo = await generateRegistrationNumber(
    prisma.doctor,
    "DOC",
    "registrationNo",
  );

  const result = await prisma.doctor.create({
    data: {
      ...data,
      registrationNo,
    },
  });

  await bumpCacheVersion("doctor");

  return result;
};

export const getDoctorByEmail = async (email: string) => {
  return prisma.doctor.findUnique({ where: { email } });
};

export const getAllDoctors = async (cursor?: string) => {
  return cursorPaginate(prisma, { model: "doctor" }, cursor);
};

export const getDoctorById = async (id: number) => {
  return prisma.doctor.findUnique({ where: { id } });
};

export const getDoctorByRegistration = async (registrationNo: string) => {
  return prisma.doctor.findUnique({ where: { registrationNo } });
};

export const getDoctorsByDepartment = async (department: string) => {
  return prisma.doctor.findMany({
    where: { department },
    orderBy: { fullName: "asc" },
  });
};

export const updateDoctor = async (id: number, data: Partial<DoctorInput>) => {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Update doctor
    const updatedDoctor = await tx.doctor.update({
      where: { id },
      data,
    });

    // 2️⃣ Prepare user update data
    const userUpdateData: any = {};

    if (data.fullName) {
      userUpdateData.name = data.fullName;
    }

    if (data.email) {
      userUpdateData.email = data.email;
    }

    // 3️⃣ Safe user update
    if (Object.keys(userUpdateData).length > 0) {
      await tx.user.updateMany({
        where: { regId: updatedDoctor.registrationNo },
        data: userUpdateData,
      });
    }

    await bumpCacheVersion("doctor");

    return updatedDoctor;
  });
};

export const deleteDoctor = async (id: number) => {
  const deletedDoctor = await prisma.$transaction(async (tx) => {
    const doctor = await tx.doctor.findUnique({
      where: { id },
      select: { registrationNo: true },
    });

    if (!doctor) return null;

    const deleted = await tx.doctor.delete({
      where: { id },
    });

    await tx.user.deleteMany({
      where: { regId: doctor.registrationNo },
    });

    return deleted;
  });

  // ✅ Fire-and-forget (non-blocking)
  bumpCacheVersion("doctor");

  return deletedDoctor;
};

export const searchDoctor = createSearchService(prisma, {
  tableName: "Doctor",
  exactFields: ["fullName", "mobileNumber", "registrationNo"],
  prefixFields: ["fullName"],
  similarFields: ["fullName"],
  selectFields: [
    "id",
    "fullName",
    "mobileNumber",
    "registrationNo",
    "qualification",
    "specialization",
    "status",
    "createdAt",   
  ],
});


type FilterDoctorParams = {
  fromDate?: Date;
  toDate?: Date;
  status?: string;
  cursor?: string;
  limit?: number;
};

export const filterDoctorsService = async (
  params: FilterDoctorParams
) => {
  const { fromDate, toDate, status, cursor, limit } = params;

  const where: Record<string, any> = {};

  // ✅ Status filter
  if (status) {
    where.status = {
      equals: status,
      mode: "insensitive",
    };
  }

  // ✅ Date range filter
  if (fromDate || toDate) {
    where.createdAt = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  // ✅ Call centralized pagination
  return filterPaginate(
    prisma,
    {
      model: "doctor",
      limit, 
    },
    cursor,
    where
  );
};
