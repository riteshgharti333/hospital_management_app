"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchBedAssignment = exports.deleteBedAssignment = exports.dischargePatient = exports.updateBedAssignment = exports.getActiveAssignments = exports.getAssignmentsByWard = exports.getAssignmentsByBed = exports.getBedAssignmentById = exports.getAllBedAssignments = exports.createBedAssignment = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const pagination_1 = require("../utils/pagination");
const searchCache_1 = require("../utils/searchCache");
const createBedAssignment = async (data) => {
    return prisma_1.prisma.bedAssignment.create({ data });
};
exports.createBedAssignment = createBedAssignment;
const getAllBedAssignments = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "bedAssignment",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllBedAssignments = getAllBedAssignments;
const getBedAssignmentById = async (id) => {
    return prisma_1.prisma.bedAssignment.findUnique({ where: { id } });
};
exports.getBedAssignmentById = getBedAssignmentById;
const getAssignmentsByBed = async (bedNumber) => {
    return prisma_1.prisma.bedAssignment.findMany({
        where: { bedNumber },
        orderBy: { allocateDate: "desc" },
    });
};
exports.getAssignmentsByBed = getAssignmentsByBed;
const getAssignmentsByWard = async (wardNumber) => {
    return prisma_1.prisma.bedAssignment.findMany({
        where: { wardNumber },
        orderBy: { allocateDate: "desc" },
    });
};
exports.getAssignmentsByWard = getAssignmentsByWard;
const getActiveAssignments = async () => {
    return prisma_1.prisma.bedAssignment.findMany({
        where: { status: "Active" },
        orderBy: { allocateDate: "desc" },
    });
};
exports.getActiveAssignments = getActiveAssignments;
const updateBedAssignment = async (id, data) => {
    return prisma_1.prisma.bedAssignment.update({
        where: { id },
        data,
    });
};
exports.updateBedAssignment = updateBedAssignment;
const dischargePatient = async (id, dischargeDate) => {
    return prisma_1.prisma.bedAssignment.update({
        where: { id },
        data: {
            status: "Discharged",
            dischargeDate,
        },
    });
};
exports.dischargePatient = dischargePatient;
const deleteBedAssignment = async (id) => {
    return prisma_1.prisma.bedAssignment.delete({ where: { id } });
};
exports.deleteBedAssignment = deleteBedAssignment;
const commonSearchFields = ["wardNumber", "bedNumber", "patientName"];
exports.searchBedAssignment = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "BedAssignment",
    cacheKeyPrefix: "bedAssignment",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
