"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescription = exports.updatePrescription = exports.getPrescriptionsByPatient = exports.getPrescriptionById = exports.getAllPrescriptions = exports.createPrescription = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPrescription = async (data) => {
    return prisma.prescription.create({
        data: {
            ...data,
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
    return prisma.prescription.findMany({
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
    return prisma.prescription.findUnique({
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
    return prisma.prescription.findMany({
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
    const updatedPrescription = await prisma.prescription.update({
        where: { id },
        data: {
            prescriptionDate: data.prescriptionDate,
            doctorId: data.doctorId,
            patientId: data.patientId,
            prescriptionDoc: data.prescriptionDoc,
            status: data.status,
        },
        include: {
            medicines: true,
        },
    });
    if (data.medicines) {
        await prisma.medicine.deleteMany({ where: { prescriptionId: id } });
        await prisma.medicine.createMany({
            data: data.medicines.map((med) => ({
                ...med,
                prescriptionId: id,
            })),
        });
    }
    return prisma.prescription.findUnique({
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
    await prisma.medicine.deleteMany({ where: { prescriptionId: id } });
    return prisma.prescription.delete({ where: { id } });
};
exports.deletePrescription = deletePrescription;
