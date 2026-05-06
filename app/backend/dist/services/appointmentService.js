"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpiredAppointments = exports.filterAppointmentsService = exports.searchAppointments = exports.deleteAppointment = exports.cancelAppointment = exports.updateAppointment = exports.getAppointmentById = exports.getAllAppointmentsService = exports.createAppointment = void 0;
const prisma_1 = require("../lib/prisma");
const cacheVersion_1 = require("../utils/cacheVersion");
const filterPaginate_1 = require("../utils/filterPaginate");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const checkAppointmentExpiry_1 = require("../utils/checkAppointmentExpiry");
const createAppointment = async (data) => {
    await (0, cacheVersion_1.bumpCacheVersion)("appointment");
    return prisma_1.prisma.appointment.create({ data });
};
exports.createAppointment = createAppointment;
const getAllAppointmentsService = async (cursor) => {
    // Update all expired appointments first
    await (0, checkAppointmentExpiry_1.checkAndUpdateExpiredAppointments)();
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "appointment",
        include: {
            doctor: {
                select: {
                    fullName: true,
                },
            },
        },
    }, cursor);
};
exports.getAllAppointmentsService = getAllAppointmentsService;
const getAppointmentById = async (id) => {
    let appointment = await prisma_1.prisma.appointment.findUnique({
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
        const expired = (0, checkAppointmentExpiry_1.isAppointmentExpired)(appointment.appointmentDate, appointment.appointmentTime);
        if (expired) {
            appointment = await prisma_1.prisma.appointment.update({
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
            await (0, cacheVersion_1.bumpCacheVersion)("appointment");
        }
    }
    return appointment;
};
exports.getAppointmentById = getAppointmentById;
const updateAppointment = async (id, data) => {
    await (0, cacheVersion_1.bumpCacheVersion)("appointment");
    return prisma_1.prisma.appointment.update({
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
exports.updateAppointment = updateAppointment;
const cancelAppointment = async (id) => {
    await (0, cacheVersion_1.bumpCacheVersion)("appointment");
    return prisma_1.prisma.appointment.update({
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
exports.cancelAppointment = cancelAppointment;
const deleteAppointment = async (id) => {
    await (0, cacheVersion_1.bumpCacheVersion)("appointment");
    return prisma_1.prisma.appointment.delete({ where: { id } });
};
exports.deleteAppointment = deleteAppointment;
exports.searchAppointments = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
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
const filterAppointmentsService = async (params) => {
    const { fromDate, toDate, status, cursor } = params;
    const where = {};
    if (status) {
        where.status = status;
    }
    if (fromDate || toDate) {
        where.appointmentDate = {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
        };
    }
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "appointment",
    }, cursor, where);
};
exports.filterAppointmentsService = filterAppointmentsService;
// Update expired appointments (for cron job or manual trigger)
const updateExpiredAppointments = async () => {
    return (0, checkAppointmentExpiry_1.checkAndUpdateExpiredAppointments)();
};
exports.updateExpiredAppointments = updateExpiredAppointments;
