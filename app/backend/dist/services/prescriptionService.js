"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrescription = exports.updatePrescription = exports.getPrescriptionsByPatient = exports.getPrescriptionById = exports.getAllPrescriptions = exports.createPrescription = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPrescription = async (data) => {
    return prisma.prescription.create({
        data: {
            ...data,
            prescriptionDoc: data.prescriptionDoc ?? null,
            medicines: {
                create: data.medicines
            }
        },
        include: {
            medicines: true,
            doctor: true,
            patient: true
        }
    });
};
exports.createPrescription = createPrescription;
const getAllPrescriptions = async () => {
    return prisma.prescription.findMany({
        orderBy: { prescriptionDate: "desc" },
        include: {
            medicines: true,
            doctor: true,
            patient: true
        }
    });
};
exports.getAllPrescriptions = getAllPrescriptions;
const getPrescriptionById = async (id) => {
    return prisma.prescription.findUnique({
        where: { id },
        include: {
            medicines: true,
            doctor: true,
            patient: true
        }
    });
};
exports.getPrescriptionById = getPrescriptionById;
const getPrescriptionsByPatient = async (patientId) => {
    return prisma.prescription.findMany({
        where: { patientId },
        orderBy: { prescriptionDate: "desc" },
        include: {
            medicines: true,
            doctor: true
        }
    });
};
exports.getPrescriptionsByPatient = getPrescriptionsByPatient;
const updatePrescription = async (id, data) => {
    // First update prescription details
    const updatedPrescription = await prisma.prescription.update({
        where: { id },
        data: {
            prescriptionDate: data.prescriptionDate,
            doctorId: data.doctorId,
            patientId: data.patientId,
            prescriptionDoc: data.prescriptionDoc ?? null, // Handle undefined → null
            status: data.status
        },
        include: {
            medicines: true
        }
    });
    // Then update medicines if provided
    if (data.medicines) {
        await prisma.$transaction([
            // Delete existing medicines
            prisma.medicine.deleteMany({
                where: { prescriptionId: id }
            }),
            // Create new medicines
            prisma.medicine.createMany({
                data: data.medicines.map(medicine => ({
                    ...medicine,
                    prescriptionId: id
                }))
            })
        ]);
    }
    return prisma.prescription.findUnique({
        where: { id },
        include: {
            medicines: true,
            doctor: true,
            patient: true
        }
    });
};
exports.updatePrescription = updatePrescription;
const deletePrescription = async (id) => {
    // First delete all medicines
    await prisma.medicine.deleteMany({
        where: { prescriptionId: id }
    });
    // Then delete the prescription
    return prisma.prescription.delete({
        where: { id }
    });
};
exports.deletePrescription = deletePrescription;
