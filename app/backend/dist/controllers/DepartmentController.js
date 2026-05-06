"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDepartments = exports.searchDepartmentResults = exports.deleteDepartmentRecord = exports.updateDepartmentRecord = exports.getDepartmentRecordById = exports.getAllDepartmentRecords = exports.createDepartmentRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const departmentService_1 = require("../services/departmentService");
const schemas_1 = require("@hospital/schemas");
const queryValidation_1 = require("../utils/queryValidation");
const prisma_1 = require("../lib/prisma");
exports.createDepartmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.departmentSchema.parse(req.body);
    // Check if department name already exists
    const existingDepartment = await prisma_1.prisma.department.findUnique({
        where: { name: validated.name },
    });
    if (existingDepartment) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: statusCodes_1.StatusCodes.CONFLICT,
            message: "Department already exists",
            data: null,
        });
    }
    // Check if doctor is already assigned to a department
    const existingHead = await prisma_1.prisma.department.findUnique({
        where: { doctorId: validated.doctorId },
    });
    if (existingHead) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: statusCodes_1.StatusCodes.CONFLICT,
            message: "Doctor already assigned to a department",
            data: null,
        });
    }
    const department = await (0, departmentService_1.createDepartment)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Department record created successfully",
        data: department,
    });
});
exports.getAllDepartmentRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor } = req.query;
    const result = await (0, departmentService_1.getAllDepartments)(cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Department records fetched",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
exports.getDepartmentRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const department = await (0, departmentService_1.getDepartmentById)(id);
    if (!department) {
        return next(new errorHandler_1.ErrorHandler("Department not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Department details fetched",
        data: department,
    });
});
exports.updateDepartmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.departmentSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    // 🔍 Check if department exists
    const existingDepartment = await prisma_1.prisma.department.findUnique({
        where: { id },
    });
    if (!existingDepartment) {
        return next(new errorHandler_1.ErrorHandler("Department not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    // 🔴 Check duplicate name (exclude current)
    if (validatedData.name) {
        const duplicateName = await prisma_1.prisma.department.findFirst({
            where: {
                name: validatedData.name,
                NOT: { id },
            },
        });
        if (duplicateName) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: statusCodes_1.StatusCodes.CONFLICT,
                message: "Department already exists",
                data: null,
            });
        }
    }
    // 🔴 Check doctor already assigned (exclude current)
    if (validatedData.doctorId) {
        const existingHead = await prisma_1.prisma.department.findFirst({
            where: {
                doctorId: validatedData.doctorId,
                NOT: { id },
            },
        });
        if (existingHead) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: statusCodes_1.StatusCodes.CONFLICT,
                message: "Doctor already assigned to a department",
                data: null,
            });
        }
    }
    const updatedDepartment = await (0, departmentService_1.updateDepartment)(id, validatedData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Department updated successfully",
        data: updatedDepartment,
    });
});
exports.deleteDepartmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedDepartment = await (0, departmentService_1.deleteDepartment)(id);
    if (!deletedDepartment) {
        return next(new errorHandler_1.ErrorHandler("Department not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Department deleted successfully",
        data: deletedDepartment,
    });
});
exports.searchDepartmentResults = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { query, cursor } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const result = await (0, departmentService_1.searchDepartment)(searchTerm, cursor);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: result.data,
        pagination: {
            nextCursor: result.pagination.nextCursor || undefined,
            hasMore: result.pagination.hasMore,
        },
    });
});
exports.filterDepartments = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.departmentFilterSchema.parse(req.query);
    const result = await (0, departmentService_1.filterDepartmentsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered departments fetched",
        data: result.data,
        pagination: {
            nextCursor: result.nextCursor || undefined,
            hasMore: result.hasMore,
        },
    });
});
