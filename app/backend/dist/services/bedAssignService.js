"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBedAssignment = exports.dischargePatient = exports.updateBedAssignment = exports.getActiveAssignments = exports.getAssignmentsByWard = exports.getAssignmentsByBed = exports.getBedAssignmentById = exports.getAllBedAssignments = exports.createBedAssignment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createBedAssignment = async (data) => {
    return prisma.bedAssignment.create({ data });
};
exports.createBedAssignment = createBedAssignment;
const getAllBedAssignments = async () => {
    return prisma.bedAssignment.findMany({ orderBy: { allocateDate: "desc" } });
};
exports.getAllBedAssignments = getAllBedAssignments;
const getBedAssignmentById = async (id) => {
    return prisma.bedAssignment.findUnique({ where: { id } });
};
exports.getBedAssignmentById = getBedAssignmentById;
const getAssignmentsByBed = async (bedNumber) => {
    return prisma.bedAssignment.findMany({
        where: { bedNumber },
        orderBy: { allocateDate: "desc" },
    });
};
exports.getAssignmentsByBed = getAssignmentsByBed;
const getAssignmentsByWard = async (wardNumber) => {
    return prisma.bedAssignment.findMany({
        where: { wardNumber },
        orderBy: { allocateDate: "desc" },
    });
};
exports.getAssignmentsByWard = getAssignmentsByWard;
const getActiveAssignments = async () => {
    return prisma.bedAssignment.findMany({
        where: { status: "Active" },
        orderBy: { allocateDate: "desc" },
    });
};
exports.getActiveAssignments = getActiveAssignments;
const updateBedAssignment = async (id, data) => {
    return prisma.bedAssignment.update({
        where: { id },
        data,
    });
};
exports.updateBedAssignment = updateBedAssignment;
const dischargePatient = async (id, dischargeDate) => {
    return prisma.bedAssignment.update({
        where: { id },
        data: {
            status: "Discharged",
            dischargeDate,
        },
    });
};
exports.dischargePatient = dischargePatient;
const deleteBedAssignment = async (id) => {
    return prisma.bedAssignment.delete({ where: { id } });
};
exports.deleteBedAssignment = deleteBedAssignment;
