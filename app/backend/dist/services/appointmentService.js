"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointment = exports.updateAppointment = exports.getAppointmentById = exports.getAllAppointments = exports.createAppointment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAppointment = async (data) => {
    return prisma.appointment.create({ data });
};
exports.createAppointment = createAppointment;
const getAllAppointments = async () => {
    return prisma.appointment.findMany({
        orderBy: { appointmentDate: "asc" },
    });
};
exports.getAllAppointments = getAllAppointments;
const getAppointmentById = async (id) => {
    return prisma.appointment.findUnique({ where: { id } });
};
exports.getAppointmentById = getAppointmentById;
const updateAppointment = async (id, data) => {
    return prisma.appointment.update({
        where: { id },
        data,
    });
};
exports.updateAppointment = updateAppointment;
const deleteAppointment = async (id) => {
    return prisma.appointment.delete({ where: { id } });
};
exports.deleteAppointment = deleteAppointment;
