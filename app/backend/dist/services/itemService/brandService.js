"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.getBrandByName = exports.getBrandById = exports.getAllBrands = exports.createBrand = void 0;
const prisma_1 = require("../../lib/prisma");
// Create a new brand
const createBrand = async (data) => {
    return prisma_1.prisma.brand.create({ data });
};
exports.createBrand = createBrand;
// Get all brands (sorted latest first)
const getAllBrands = async () => {
    return prisma_1.prisma.brand.findMany({
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllBrands = getAllBrands;
// Get brand by ID
const getBrandById = async (id) => {
    return prisma_1.prisma.brand.findUnique({ where: { id } });
};
exports.getBrandById = getBrandById;
// Get brand by Name
const getBrandByName = async (brandName) => {
    return prisma_1.prisma.brand.findUnique({ where: { brandName } });
};
exports.getBrandByName = getBrandByName;
// Update a brand
const updateBrand = async (id, data) => {
    return prisma_1.prisma.brand.update({ where: { id }, data });
};
exports.updateBrand = updateBrand;
// Delete a brand
const deleteBrand = async (id) => {
    return prisma_1.prisma.brand.delete({ where: { id } });
};
exports.deleteBrand = deleteBrand;
