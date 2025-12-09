"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAppointmentsService = exports.searchAppointment = exports.deleteAppointment = exports.updateAppointment = exports.getAppointmentById = exports.getAllAppointments = exports.createAppointment = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const pagination_1 = require("../utils/pagination");
const filterPaginate_1 = require("../utils/filterPaginate");
const searchCache_1 = require("../utils/searchCache");
const createAppointment = async (data) => {
    return prisma_1.prisma.appointment.create({ data });
};
exports.createAppointment = createAppointment;
const getAllAppointments = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "appointment",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllAppointments = getAllAppointments;
const getAppointmentById = async (id) => {
    return prisma_1.prisma.appointment.findUnique({ where: { id } });
};
exports.getAppointmentById = getAppointmentById;
const updateAppointment = async (id, data) => {
    return prisma_1.prisma.appointment.update({
        where: { id },
        data,
    });
};
exports.updateAppointment = updateAppointment;
const deleteAppointment = async (id) => {
    return prisma_1.prisma.appointment.delete({ where: { id } });
};
exports.deleteAppointment = deleteAppointment;
const commonSearchFields = ["doctorName", "department"];
exports.searchAppointment = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Appointment",
    cacheKeyPrefix: "appointment",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterAppointmentsService = async (filters) => {
    const { fromDate, toDate, department, cursor, limit } = filters;
    const filterObj = {};
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
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "appointment",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterAppointmentsService = filterAppointmentsService;
