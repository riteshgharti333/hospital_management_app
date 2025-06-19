"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrandRecord = exports.updateBrandRecord = exports.getBrandRecordById = exports.getAllBrandRecords = exports.createBrandRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const brandService_1 = require("../../services/itemService/brandService");
const schemas_1 = require("@hospital/schemas");
exports.createBrandRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { file } = req;
    // Parse and validate req.body
    const validated = schemas_1.brandSchema.parse({
        ...req.body,
        brandLogo: file?.path // This can be string or undefined
    });
    // Check for duplicate brand name
    const existing = await (0, brandService_1.getBrandByName)(validated.brandName);
    if (existing) {
        return next(new errorHandler_1.ErrorHandler("Brand with this name already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    // Create brand - no need for separate payload object
    const brand = await (0, brandService_1.createBrand)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Brand created successfully",
        data: brand,
    });
});
exports.getAllBrandRecords = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const brands = await (0, brandService_1.getAllBrands)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "All brands fetched",
        data: brands,
    });
});
exports.getBrandRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const brand = await (0, brandService_1.getBrandById)(id);
    if (!brand) {
        return next(new errorHandler_1.ErrorHandler("Brand not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Brand details fetched",
        data: brand,
    });
});
exports.updateBrandRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const validated = schemas_1.brandSchema.partial().parse(req.body);
    if (validated.brandName) {
        const existing = await (0, brandService_1.getBrandByName)(validated.brandName);
        if (existing && existing.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another brand with this name already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updated = await (0, brandService_1.updateBrand)(id, validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Brand updated successfully",
        data: updated,
    });
});
exports.deleteBrandRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deleted = await (0, brandService_1.deleteBrand)(id);
    if (!deleted) {
        return next(new errorHandler_1.ErrorHandler("Brand not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Brand deleted successfully",
        data: deleted,
    });
});
