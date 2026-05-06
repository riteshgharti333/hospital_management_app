import { prisma } from "../lib/prisma";
import { bumpCacheVersion } from "../utils/cacheVersion";
import { filterPaginate } from "../utils/filterPaginate";
import { cursorPaginate } from "../utils/pagination";
import { createSearchService } from "../utils/searchCache";
import {
  checkAndUpdateExpiredAppointments,
  isAppointmentExpired,
} from "../utils/checkAppointmentExpiry";

export type AppointmentInput = {
  appointmentDate: Date;
  appointmentTime: string;
  doctorId: number;
  status?: "BOOKED" | "CANCELLED" | "EXPIRED";
};

export const createAppointment = async (data: AppointmentInput) => {
  await bumpCacheVersion("appointment");
  return prisma.appointment.create({ data });
};

export const getAllAppointmentsService = async (cursor?: string) => {
  // Update all expired appointments first
  await checkAndUpdateExpiredAppointments();

  return cursorPaginate(
    prisma,
    {
      model: "appointment",
      include: {
        doctor: {
          select: {
            fullName: true,
          },
        },
      },
    },
    cursor,
  );
};

export const getAppointmentById = async (id: number) => {
  let appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      doctor: {
        select: {
          fullName: true,
        },
      },
    },
  });

  if (appointment && appointment.status === "BOOKED") {
    const expired = isAppointmentExpired(
      appointment.appointmentDate,
      appointment.appointmentTime,
    );

    if (expired) {
      appointment = await prisma.appointment.update({
        where: { id },
        data: { status: "EXPIRED" },
        include: {
          doctor: {
            select: {
              fullName: true,
            },
          },
        },
      });
      await bumpCacheVersion("appointment");
    }
  }

  return appointment;
};

export const updateAppointment = async (
  id: number,
  data: Partial<AppointmentInput>,
) => {
  await bumpCacheVersion("appointment");
  return prisma.appointment.update({
    where: { id },
    data,
    include: {
      doctor: {
        select: {
          fullName: true,
        },
      },
    },
  });
};

export const cancelAppointment = async (id: number) => {
  await bumpCacheVersion("appointment");
  return prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: {
      doctor: {
        select: {
          fullName: true,
        },
      },
    },
  });
};

export const deleteAppointment = async (id: number) => {
  await bumpCacheVersion("appointment");
  return prisma.appointment.delete({ where: { id } });
};

export const searchAppointments = createSearchService(prisma, {
  tableName: "Appointment",
  exactFields: [],
  prefixFields: [],
  similarFields: ["appointmentTime"],

  relationFields: {
    doctor: ["fullName"],
  },

  include: {
    doctor: {
      select: {
        id: true,
        fullName: true,
      },
    },
  },

  sortField: "createdAt",
});

type FilterAppointmentParams = {
  fromDate?: Date;
  toDate?: Date;
  status?: string;
  cursor?: string;
};

export const filterAppointmentsService = async (
  params: FilterAppointmentParams,
) => {
  const { fromDate, toDate, status, cursor } = params;

  const where: Record<string, any> = {};

  if (status) {
    where.status = status;
  }

  if (fromDate || toDate) {
    where.appointmentDate = {
      ...(fromDate && { gte: fromDate }),
      ...(toDate && { lte: toDate }),
    };
  }

  return filterPaginate(
    prisma,
    {
      model: "appointment",
    },
    cursor,
    where,
  );
};

// Update expired appointments (for cron job or manual trigger)
export const updateExpiredAppointments = async () => {
  return checkAndUpdateExpiredAppointments();
};
