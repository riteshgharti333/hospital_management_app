"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescription = exports.updatePrescription = exports.getPrescriptionsByPatient = exports.getPrescriptionById = exports.getAllPrescriptions = exports.createPrescription = void 0;
const prisma_1 = require("../lib/prisma");
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
const getAllPrescriptions = async () => {
    return prisma_1.prisma.prescription.findMany({
        orderBy: { prescriptionDate: "desc" },
        include: {
            medicines: true,
            doctor: true,
            patient: true,
        },
    });
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
