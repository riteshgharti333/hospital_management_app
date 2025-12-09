"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAmbulance = exports.deleteAmbulance = exports.updateAmbulance = exports.getAmbulanceByRegistration = exports.getAmbulanceById = exports.getAllAmbulances = exports.createAmbulance = void 0;
const prisma_1 = require("../lib/prisma");
const applyCommonFields_1 = require("../utils/applyCommonFields");
const searchCache_1 = require("../utils/searchCache");
const createAmbulance = async (data) => {
    return prisma_1.prisma.ambulance.create({ data });
};
exports.createAmbulance = createAmbulance;
const getAllAmbulances = async (status) => {
    const where = status ? { status } : {};
    return prisma_1.prisma.ambulance.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllAmbulances = getAllAmbulances;
const getAmbulanceById = async (id) => {
    return prisma_1.prisma.ambulance.findUnique({ where: { id } });
};
exports.getAmbulanceById = getAmbulanceById;
const getAmbulanceByRegistration = async (registrationNo) => {
    return prisma_1.prisma.ambulance.findUnique({ where: { registrationNo } });
};
exports.getAmbulanceByRegistration = getAmbulanceByRegistration;
const updateAmbulance = async (id, data) => {
    return prisma_1.prisma.ambulance.update({ where: { id }, data });
};
exports.updateAmbulance = updateAmbulance;
const deleteAmbulance = async (id) => {
    return prisma_1.prisma.ambulance.delete({ where: { id } });
};
exports.deleteAmbulance = deleteAmbulance;
const commonSearchFields = ["modelName", "brand", "registrationNo"];
exports.searchAmbulance = (0, searchCache_1.createSearchService)(prisma_1.prisma, {
    tableName: "Ambulance",
    cacheKeyPrefix: "ambulance",
    ...(0, applyCommonFields_1.applyCommonFields)(commonSearchFields),
});
