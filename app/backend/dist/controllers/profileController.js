"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateProfile = exports.getProfileById = exports.getAllProfiles = exports.createProfile = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const prisma = new client_1.PrismaClient();
const profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
// CREATE
exports.createProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = profileSchema.parse(req.body);
    const profile = await prisma.profile.create({ data: validated });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Profile created successfully",
        data: profile,
    });
});
// GET ALL
exports.getAllProfiles = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const profiles = await prisma.profile.findMany();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "All profiles fetched",
        data: profiles,
    });
});
// GET SINGLE BY ID
exports.getProfileById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile)
        return next(new errorHandler_1.ErrorHandler("Profile not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Profile details fetched",
        data: profile,
    });
});
// UPDATE
exports.updateProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    // Allow partial update
    const partialSchema = profileSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedProfile = await prisma.profile.update({
        where: { id },
        data: validatedData,
    });
    if (!updatedProfile)
        return next(new errorHandler_1.ErrorHandler("Profile not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Profile updated successfully",
        data: updatedProfile,
    });
});
// DELETE
exports.deleteProfile = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    const deletedProfile = await prisma.profile.delete({ where: { id } });
    if (!deletedProfile)
        return next(new errorHandler_1.ErrorHandler("Profile not found", statusCodes_1.StatusCodes.NOT_FOUND));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Profile deleted successfully",
        data: deletedProfile,
    });
});
