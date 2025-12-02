import { prisma } from "../lib/prisma";
import { applyCommonFields } from "../utils/applyCommonFields";
import { cursorPaginate } from "../utils/pagination";
import { filterPaginate } from "../utils/filterPaginate";
import { createSearchService } from "../utils/searchCache";

export type AppointmentInput = {
  appointmentDate: Date;
  doctorName: string;
  department: string;
  appointmentTime: string;
};

export const createAppointment = async (data: AppointmentInput) => {
  return prisma.appointment.create({ data });
};

export const getAllAppointments = async (
  cursor?: string,
  limit?: number
) => {
  return cursorPaginate(
    prisma,
    {
      model: "appointment",
      cursorField: "id",
      limit: limit || 50,
      cacheExpiry: 600,
    },
    cursor ? Number(cursor) : undefined
  );
};

export const getAppointmentById = async (id: number) => {
  return prisma.appointment.findUnique({ where: { id } });
};

export const updateAppointment = async (
  id: number,
  data: Partial<AppointmentInput>
) => {
  return prisma.appointment.update({
    where: { id },
    data,
  });
};

export const deleteAppointment = async (id: number) => {
  return prisma.appointment.delete({ where: { id } });
};

const commonSearchFields = ["doctorName", "department"];

export const searchAppointment = createSearchService(prisma, {
  tableName: "Appointment",
  cacheKeyPrefix: "appointment",
  ...applyCommonFields(commonSearchFields),
});


export const filterAppointmentsService = async (filters: {
  fromDate?: Date;
  toDate?: Date;
  department?: string;
  cursor?: string | number;
  limit?: number;
}) => {
  const { fromDate, toDate, department, cursor, limit } = filters;

  const filterObj: Record<string, any> = {};

  if (department)
    filterObj.department = {
      equals: department,
      mode: "insensitive",
    };

  if (fromDate || toDate)
    filterObj.appointmentDate = {
      gte: fromDate ? new Date(fromDate) : undefined,
      lte: toDate ? new Date(toDate) : undefined,
    };

  return filterPaginate(
    prisma,
    {
      model: "appointment",
      cursorField: "id",
      limit: limit || 50,
      filters: filterObj,
    },
    cursor
  );
};
