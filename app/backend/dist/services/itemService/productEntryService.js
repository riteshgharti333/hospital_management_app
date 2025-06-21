"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductsByCategory = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const prisma_1 = require("../../lib/prisma");
const createProduct = async (data) => {
    const createData = {
        ...data,
        specifications: data.specifications
            ? { create: data.specifications }
            : undefined
    };
    return prisma_1.prisma.productEntery.create({
        data: createData,
        include: { specifications: true },
    });
};
exports.createProduct = createProduct;
const getAllProducts = async () => {
    return prisma_1.prisma.productEntery.findMany({
        orderBy: { createdAt: "desc" },
        include: { specifications: true },
    });
};
exports.getAllProducts = getAllProducts;
const getProductById = async (id) => {
    return prisma_1.prisma.productEntery.findUnique({
        where: { id },
        include: { specifications: true },
    });
};
exports.getProductById = getProductById;
const getProductsByCategory = async (category) => {
    return prisma_1.prisma.productEntery.findMany({
        where: { category },
        orderBy: { productName: "asc" },
        include: { specifications: true },
    });
};
exports.getProductsByCategory = getProductsByCategory;
const updateProduct = async (id, data) => {
    return prisma_1.prisma.productEntery.update({
        where: { id },
        data: {
            ...data,
            specifications: data.specifications,
        },
        include: { specifications: true },
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    return prisma_1.prisma.productEntery.delete({
        where: { id },
        include: { specifications: true },
    });
};
exports.deleteProduct = deleteProduct;
