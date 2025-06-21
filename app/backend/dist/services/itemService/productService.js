"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductsByCategory = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const prisma_1 = require("../../lib/prisma");
// ✅ Create Product
const createProduct = async (data) => {
    return prisma_1.prisma.product.create({
        data: {
            ...data,
            status: data.status ?? "Active", // default fallback
        },
    });
};
exports.createProduct = createProduct;
// ✅ Get All Products
const getAllProducts = async () => {
    return prisma_1.prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllProducts = getAllProducts;
// ✅ Get Product by ID
const getProductById = async (id) => {
    return prisma_1.prisma.product.findUnique({
        where: { id },
    });
};
exports.getProductById = getProductById;
// ✅ Get Products by Category (Parent + Subcategory)
const getProductsByCategory = async (parentCategory, subCategory) => {
    return prisma_1.prisma.product.findMany({
        where: {
            parentCategory,
            ...(subCategory && { subCategory }),
        },
        orderBy: { productName: "asc" },
    });
};
exports.getProductsByCategory = getProductsByCategory;
// ✅ Update Product
const updateProduct = async (id, data) => {
    return prisma_1.prisma.product.update({
        where: { id },
        data,
    });
};
exports.updateProduct = updateProduct;
// ✅ Delete Product
const deleteProduct = async (id) => {
    return prisma_1.prisma.product.delete({
        where: { id },
    });
};
exports.deleteProduct = deleteProduct;
