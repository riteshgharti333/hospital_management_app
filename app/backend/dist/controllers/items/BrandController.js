"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrandRecord = exports.updateBrandRecord = exports.getBrandRecordById = exports.getAllBrandRecords = exports.createBrandRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const brandService_1 = require("../../services/itemService/brandService");
const schemas_1 = require("@hospital/schemas");
const cloudinaryUploader_1 = require("../../utils/cloudinaryUploader");
const createBrandRecord = async (req, res, next) => {
    try {
        let uploadedUrl;
        if (req.file) {
            uploadedUrl = await (0, cloudinaryUploader_1.uploadToCloudinary)(req.file.buffer);
        }
        const validated = schemas_1.brandSchema.parse({
            ...req.body,
            brandLogo: uploadedUrl,
        });
        const existing = await (0, brandService_1.getBrandByName)(validated.brandName);
        if (existing) {
            return next(new errorHandler_1.ErrorHandler("Brand with this name already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
        const brand = await (0, brandService_1.createBrand)(validated);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.CREATED,
            message: "Brand created successfully",
            data: brand,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createBrandRecord = createBrandRecord;
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
    const existingBrand = await (0, brandService_1.getBrandById)(id);
    if (!existingBrand) {
        return next(new errorHandler_1.ErrorHandler("Brand not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    let uploadedUrl;
    if (req.file) {
        if (existingBrand.brandLogo) {
            await (0, cloudinaryUploader_1.deleteFromCloudinary)(existingBrand.brandLogo);
        }
        uploadedUrl = await (0, cloudinaryUploader_1.uploadToCloudinary)(req.file.buffer);
    }
    const partialSchema = schemas_1.brandSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        brandLogo: uploadedUrl ?? req.body.brandLogo ?? undefined,
    });
    if (validatedData.brandName) {
        const existing = await (0, brandService_1.getBrandByName)(validatedData.brandName);
        if (existing && existing.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another brand with this name already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedBrand = await (0, brandService_1.updateBrand)(id, validatedData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Brand updated successfully",
        data: updatedBrand,
    });
});
exports.deleteBrandRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const existingBrand = await (0, brandService_1.getBrandById)(id);
    if (!existingBrand) {
        return next(new errorHandler_1.ErrorHandler("Brand not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    if (existingBrand.brandLogo) {
        await (0, cloudinaryUploader_1.deleteFromCloudinary)(existingBrand.brandLogo);
    }
    await (0, brandService_1.deleteBrand)(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Brand deleted successfully",
    });
});
