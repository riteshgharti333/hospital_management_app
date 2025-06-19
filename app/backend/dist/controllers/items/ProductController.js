"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductRecord = exports.updateProductRecord = exports.getProductRecordById = exports.getAllProductRecords = exports.createProductRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const productService_1 = require("../../services/itemService/productService");
const schemas_1 = require("@hospital/schemas");
exports.createProductRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.productSchema.parse(req.body);
    // Check if product code already exists
    const existingProduct = await (0, productService_1.getProductByCode)(validated.productCode);
    if (existingProduct) {
        return next(new errorHandler_1.ErrorHandler("Product with this code already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const product = await (0, productService_1.createProduct)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Product created successfully",
        data: product,
    });
});
exports.getAllProductRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const parentCategory = req.query.parentCategory;
    const subCategory = req.query.subCategory;
    const products = parentCategory
        ? await (0, productService_1.getProductsByCategory)(parentCategory, subCategory)
        : await (0, productService_1.getAllProducts)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: parentCategory
            ? subCategory
                ? `Products in ${parentCategory} > ${subCategory} fetched`
                : `Products in ${parentCategory} category fetched`
            : "All products fetched",
        data: products,
    });
});
exports.getProductRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const product = await (0, productService_1.getProductById)(id);
    if (!product) {
        return next(new errorHandler_1.ErrorHandler("Product not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Product details fetched",
        data: product,
    });
});
exports.updateProductRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.productSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // Check if updating product code to an existing one
    if (validatedData.productCode) {
        const existingProduct = await (0, productService_1.getProductByCode)(validatedData.productCode);
        if (existingProduct && existingProduct.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another product with this code already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedProduct = await (0, productService_1.updateProduct)(id, validatedData);
    if (!updatedProduct) {
        return next(new errorHandler_1.ErrorHandler("Product not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Product updated successfully",
        data: updatedProduct,
    });
});
exports.deleteProductRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedProduct = await (0, productService_1.deleteProduct)(id);
    if (!deletedProduct) {
        return next(new errorHandler_1.ErrorHandler("Product not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Product deleted successfully",
        data: deletedProduct,
    });
});
