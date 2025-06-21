"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductRecord = exports.updateProductRecord = exports.getProductRecordById = exports.getAllProductRecords = exports.createProductRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const productService_1 = require("../../services/itemService/productService");
const schemas_1 = require("@hospital/schemas");
const cloudinaryUploader_1 = require("../../utils/cloudinaryUploader");
// ✅ CREATE
exports.createProductRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    let uploadedLogoUrl;
    if (req.file) {
        uploadedLogoUrl = await (0, cloudinaryUploader_1.uploadToCloudinary)(req.file.buffer);
    }
    const validated = schemas_1.productSchema.parse({
        ...req.body,
        categoryLogo: uploadedLogoUrl, // ✅ attach cloudinary URL
    });
    const product = await (0, productService_1.createProduct)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Product created successfully",
        data: product,
    });
});
// ✅ GET ALL
exports.getAllProductRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const parentCategory = req.query.parentCategory;
    const subCategory = req.query.subCategory;
    const products = parentCategory
        ? await (0, productService_1.getProductsByCategory)(parentCategory)
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
// ✅ GET BY ID
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
// ✅ UPDATE
exports.updateProductRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const existing = await (0, productService_1.getProductById)(id);
    if (!existing) {
        return next(new errorHandler_1.ErrorHandler("Product not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    let uploadedLogoUrl;
    if (req.file) {
        // ❌ delete old logo
        if (existing.categoryLogo) {
            await (0, cloudinaryUploader_1.deleteFromCloudinary)(existing.categoryLogo);
        }
        uploadedLogoUrl = await (0, cloudinaryUploader_1.uploadToCloudinary)(req.file.buffer);
    }
    const partialSchema = schemas_1.productSchema.partial();
    const validated = partialSchema.parse({
        ...req.body,
        categoryLogo: uploadedLogoUrl ?? req.body.categoryLogo ?? undefined,
    });
    const updated = await (0, productService_1.updateProduct)(id, validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Product updated successfully",
        data: updated,
    });
});
// ✅ DELETE
exports.deleteProductRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const product = await (0, productService_1.getProductById)(id);
    if (!product) {
        return next(new errorHandler_1.ErrorHandler("Product not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    // ✅ Delete file from Cloudinary
    if (product.categoryLogo) {
        await (0, cloudinaryUploader_1.deleteFromCloudinary)(product.categoryLogo);
    }
    const deletedProduct = await (0, productService_1.deleteProduct)(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Product deleted successfully",
        data: deletedProduct,
    });
});
