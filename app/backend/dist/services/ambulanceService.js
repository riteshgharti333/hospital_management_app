"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAmbulance = exports.updateAmbulance = exports.getAmbulanceByRegistration = exports.getAmbulanceById = exports.getAllAmbulances = exports.createAmbulance = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAmbulance = async (data) => {
    return prisma.ambulance.create({ data });
};
exports.createAmbulance = createAmbulance;
const getAllAmbulances = async (status) => {
    const where = status ? { status } : {};
    return prisma.ambulance.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllAmbulances = getAllAmbulances;
const getAmbulanceById = async (id) => {
    return prisma.ambulance.findUnique({ where: { id } });
};
exports.getAmbulanceById = getAmbulanceById;
const getAmbulanceByRegistration = async (registrationNo) => {
    return prisma.ambulance.findUnique({ where: { registrationNo } });
};
exports.getAmbulanceByRegistration = getAmbulanceByRegistration;
const updateAmbulance = async (id, data) => {
    return prisma.ambulance.update({ where: { id }, data });
};
exports.updateAmbulance = updateAmbulance;
const deleteAmbulance = async (id) => {
    return prisma.ambulance.delete({ where: { id } });
};
exports.deleteAmbulance = deleteAmbulance;
