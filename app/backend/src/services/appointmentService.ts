import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type AppointmentInput = {
  appointmentDate: Date;
  doctorName: string;
  department: string;
  appointmentTime: string;
};

export const createAppointment = async (data: AppointmentInput) => {
  return prisma.appointment.create({ data });
};

export const getAllAppointments = async () => {
  return prisma.appointment.findMany({
    orderBy: { appointmentDate: "asc" },
  });
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
