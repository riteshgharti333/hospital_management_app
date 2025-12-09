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
exports.createDepartmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.departmentSchema.parse(req.body);
    // Check if department name already exists
    const existingDept = await (0, departmentService_1.getDepartmentByName)(validated.name);
    if (existingDept) {
        return next(new errorHandler_1.ErrorHandler("Department with this name already exists", statusCodes_1.StatusCodes.CONFLICT));
    }
    const department = await (0, departmentService_1.createDepartment)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Department created successfully",
        data: department,
    });
});
exports.getAllDepartmentRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { cursor, limit } = req.query;
    const { data: department, nextCursor } = await (0, departmentService_1.getAllDepartmentService)(cursor, limit ? Number(limit) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Department records fetched",
        data: department,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: limit ? Number(limit) : 50,
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
    // Check if updating name to an existing one
    if (validatedData.name) {
        const existingDept = await (0, departmentService_1.getDepartmentByName)(validatedData.name);
        if (existingDept && existingDept.id !== id) {
            return next(new errorHandler_1.ErrorHandler("Another department with this name already exists", statusCodes_1.StatusCodes.CONFLICT));
        }
    }
    const updatedDepartment = await (0, departmentService_1.updateDepartment)(id, validatedData);
    if (!updatedDepartment) {
        return next(new errorHandler_1.ErrorHandler("Department not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
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
    const { query } = req.query;
    const searchTerm = (0, queryValidation_1.validateSearchQuery)(query, next);
    if (!searchTerm)
        return;
    const departments = await (0, departmentService_1.searchDepartment)(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Search results fetched successfully",
        data: departments,
    });
});
exports.filterDepartments = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const validated = schemas_1.departmentFilterSchema.parse(req.query);
    const { data, nextCursor } = await (0, departmentService_1.filterDepartmentsService)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Filtered departments fetched",
        data,
        pagination: {
            nextCursor: nextCursor !== null ? String(nextCursor) : undefined,
            limit: validated.limit || 50,
        },
    });
});
