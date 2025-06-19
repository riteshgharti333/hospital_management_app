"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteServiceCharge = exports.updateServiceCharge = exports.getServiceChargesByCategory = exports.getServiceChargeById = exports.getAllServiceCharges = exports.createServiceCharge = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createServiceCharge = async (data) => {
    return prisma.serviceCharge.create({ data });
};
exports.createServiceCharge = createServiceCharge;
const getAllServiceCharges = async () => {
    return prisma.serviceCharge.findMany({
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllServiceCharges = getAllServiceCharges;
const getServiceChargeById = async (id) => {
    return prisma.serviceCharge.findUnique({ where: { id } });
};
exports.getServiceChargeById = getServiceChargeById;
const getServiceChargesByCategory = async (category) => {
    return prisma.serviceCharge.findMany({
        where: { category },
        orderBy: { serviceName: "asc" },
    });
};
exports.getServiceChargesByCategory = getServiceChargesByCategory;
const updateServiceCharge = async (id, data) => {
    return prisma.serviceCharge.update({
        where: { id },
        data,
    });
};
exports.updateServiceCharge = updateServiceCharge;
const deleteServiceCharge = async (id) => {
    return prisma.serviceCharge.delete({ where: { id } });
};
exports.deleteServiceCharge = deleteServiceCharge;
