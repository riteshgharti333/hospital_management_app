"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePharmacist = exports.updatePharmacist = exports.getPharmacistsByDepartment = exports.getPharmacistByRegistration = exports.getPharmacistById = exports.getAllPharmacists = exports.createPharmacist = void 0;
const prisma_1 = require("../lib/prisma");
const createPharmacist = async (data) => {
    // Check for duplicate registration number
    const existing = await prisma_1.prisma.pharmacist.findUnique({
        where: { registrationNo: data.registrationNo }
    });
    if (existing) {
        throw new Error("Pharmacist with this registration number already exists");
    }
    return prisma_1.prisma.pharmacist.create({
        data: {
            ...data,
            status: data.status ?? "Active" // Default status
        }
    });
};
exports.createPharmacist = createPharmacist;
const getAllPharmacists = async () => {
    return prisma_1.prisma.pharmacist.findMany({
        orderBy: { createdAt: "desc" }
    });
};
exports.getAllPharmacists = getAllPharmacists;
const getPharmacistById = async (id) => {
    return prisma_1.prisma.pharmacist.findUnique({
        where: { id }
    });
};
exports.getPharmacistById = getPharmacistById;
const getPharmacistByRegistration = async (registrationNo) => {
    return prisma_1.prisma.pharmacist.findUnique({
        where: { registrationNo }
    });
};
exports.getPharmacistByRegistration = getPharmacistByRegistration;
const getPharmacistsByDepartment = async (department) => {
    return prisma_1.prisma.pharmacist.findMany({
        where: { department },
        orderBy: { fullName: "asc" }
    });
};
exports.getPharmacistsByDepartment = getPharmacistsByDepartment;
const updatePharmacist = async (id, data) => {
    // Prevent duplicate registration numbers on update
    if (data.registrationNo) {
        const existing = await prisma_1.prisma.pharmacist.findFirst({
            where: {
                registrationNo: data.registrationNo,
                NOT: { id }
            }
        });
        if (existing) {
            throw new Error("Another pharmacist with this registration number already exists");
        }
    }
    return prisma_1.prisma.pharmacist.update({
        where: { id },
        data
    });
};
exports.updatePharmacist = updatePharmacist;
const deletePharmacist = async (id) => {
    return prisma_1.prisma.pharmacist.delete({
        where: { id }
    });
};
exports.deletePharmacist = deletePharmacist;
