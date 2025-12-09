"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterPrescriptionsService = exports.searchPrescription = exports.deletePrescription = exports.updatePrescription = exports.getPrescriptionsByPatient = exports.getPrescriptionById = exports.getAllPrescriptions = exports.createPrescription = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const pagination_1 = require("../utils/pagination");
const filterPaginate_1 = require("../utils/filterPaginate");
const searchCache_1 = require("../utils/searchCache");
const createPrescription = async (data) => {
    return prisma_1.prisma.prescription.create({
        data: {
            ...data,
            prescriptionDoc: data.prescriptionDoc ?? null,
            medicines: {
                create: data.medicines,
            },
        },
        include: {
            medicines: true,
            doctor: true,
            patient: true,
        },
    });
};
exports.createPrescription = createPrescription;
const getAllPrescriptions = async (cursor, limit) => {
    return (0, pagination_1.cursorPaginate)(prisma_1.prisma, {
        model: "prescription",
        cursorField: "id",
        limit: limit || 50,
        cacheExpiry: 600,
    }, cursor ? Number(cursor) : undefined);
};
exports.getAllPrescriptions = getAllPrescriptions;
const getPrescriptionById = async (id) => {
    return prisma_1.prisma.prescription.findUnique({
        where: { id },
        include: {
            medicines: true,
            doctor: true,
            patient: true,
        },
    });
};
exports.getPrescriptionById = getPrescriptionById;
const getPrescriptionsByPatient = async (patientId) => {
    return prisma_1.prisma.prescription.findMany({
        where: { patientId },
        orderBy: { prescriptionDate: "desc" },
        include: {
            medicines: true,
            doctor: true,
        },
    });
};
exports.getPrescriptionsByPatient = getPrescriptionsByPatient;
const updatePrescription = async (id, data) => {
    // First update main prescription
    const updatedPrescription = await prisma_1.prisma.prescription.update({
        where: { id },
        data: {
            prescriptionDate: data.prescriptionDate,
            doctorId: data.doctorId,
            patientId: data.patientId,
            prescriptionDoc: data.prescriptionDoc ?? null,
            status: data.status,
        },
        include: {
            medicines: true,
        },
    });
    // Then handle medicines if provided
    if (data.medicines) {
        await prisma_1.prisma.$transaction([
            prisma_1.prisma.medicine.deleteMany({
                where: { prescriptionId: id },
            }),
            prisma_1.prisma.medicine.createMany({
                data: data.medicines.map((medicine) => ({
                    ...medicine,
                    prescriptionId: id,
                })),
            }),
        ]);
    }
    return prisma_1.prisma.prescription.findUnique({
        where: { id },
        include: {
            medicines: true,
            doctor: true,
            patient: true,
        },
    });
};
exports.updatePrescription = updatePrescription;
const deletePrescription = async (id) => {
    await prisma_1.prisma.medicine.deleteMany({
        where: { prescriptionId: id },
    });
    return prisma_1.prisma.prescription.delete({
        where: { id },
    });
};
exports.deletePrescription = deletePrescription;
const commonSearchFields = ["doctor.fullName", "patient.fullName"];
exports.searchPrescription = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Prescription",
    cacheKeyPrefix: "prescription",
    include: {
        doctor: true,
        patient: true,
    },
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
const filterPrescriptionsService = async (filters) => {
    const { fromDate, toDate, cursor, limit } = filters;
    const filterObj = {};
    if (fromDate || toDate)
        filterObj.prescriptionDate = {
            gte: fromDate ? new Date(fromDate) : undefined,
            lte: toDate ? new Date(toDate) : undefined,
        };
    return (0, filterPaginate_1.filterPaginate)(prisma_1.prisma, {
        model: "prescription",
        cursorField: "id",
        limit: limit || 50,
        filters: filterObj,
    }, cursor);
};
exports.filterPrescriptionsService = filterPrescriptionsService;
