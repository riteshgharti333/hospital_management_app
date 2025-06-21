"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeeRecord = exports.updateEmployeeRecord = exports.getEmployeeRecordById = exports.getAllEmployeeRecords = exports.createEmployeeRecord = void 0;
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const employeeService_1 = require("../../services/transectionService/employeeService");
const schemas_1 = require("@hospital/schemas");
const cloudinaryUploader_1 = require("../../utils/cloudinaryUploader");
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
// CREATE EMPLOYEE
const createEmployeeRecord = async (req, res, next) => {
    try {
        let uploadedUrl;
        if (req.file) {
            uploadedUrl = await (0, cloudinaryUploader_1.uploadToCloudinary)(req.file.buffer);
        }
        const validated = schemas_1.employeeSchema.parse({
            ...req.body,
            photoUrl: uploadedUrl,
        });
        // Check for unique fields
        if (validated.email) {
            const existingEmail = await (0, employeeService_1.getEmployeeByEmail)(validated.email);
            if (existingEmail) {
                return next(new errorHandler_1.ErrorHandler("Email already in use", statusCodes_1.StatusCodes.CONFLICT));
            }
        }
        if (validated.aadharNo) {
            const existingAadhar = await (0, employeeService_1.getEmployeeByAadhar)(validated.aadharNo);
            if (existingAadhar) {
                return next(new errorHandler_1.ErrorHandler("Aadhar number already exists", statusCodes_1.StatusCodes.CONFLICT));
            }
        }
        if (validated.voterId) {
            const existingVoter = await (0, employeeService_1.getEmployeeByVoterId)(validated.voterId);
            if (existingVoter) {
                return next(new errorHandler_1.ErrorHandler("Voter ID already exists", statusCodes_1.StatusCodes.CONFLICT));
            }
        }
        const employee = await (0, employeeService_1.createEmployee)(validated);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.CREATED,
            message: "Employee created successfully",
            data: employee,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createEmployeeRecord = createEmployeeRecord;
// GET ALL EMPLOYEES or FILTER BY DEPARTMENT
exports.getAllEmployeeRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const department = req.query.department;
    const employees = department
        ? await (0, employeeService_1.getEmployeesByDepartment)(department)
        : await (0, employeeService_1.getAllEmployees)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: department ? `Employees in ${department} department fetched` : "All employees fetched",
        data: employees,
    });
});
// GET SINGLE EMPLOYEE BY ID
exports.getEmployeeRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const employee = await (0, employeeService_1.getEmployeeById)(id);
    if (!employee) {
        return next(new errorHandler_1.ErrorHandler("Employee not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Employee record fetched",
        data: employee,
    });
});
// UPDATE EMPLOYEE
const updateEmployeeRecord = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
        }
        const existingEmployee = await (0, employeeService_1.getEmployeeById)(id);
        if (!existingEmployee) {
            return next(new errorHandler_1.ErrorHandler("Employee not found", statusCodes_1.StatusCodes.NOT_FOUND));
        }
        let uploadedUrl;
        if (req.file) {
            if (existingEmployee.photoUrl) {
                await (0, cloudinaryUploader_1.deleteFromCloudinary)(existingEmployee.photoUrl);
            }
            uploadedUrl = await (0, cloudinaryUploader_1.uploadToCloudinary)(req.file.buffer);
        }
        const partialSchema = schemas_1.employeeSchema.partial();
        const validatedData = partialSchema.parse({
            ...req.body,
            photoUrl: uploadedUrl ?? req.body.photoUrl ?? undefined,
        });
        // Check for unique fields during update
        if (validatedData.email) {
            const existingEmail = await (0, employeeService_1.getEmployeeByEmail)(validatedData.email);
            if (existingEmail && existingEmail.id !== id) {
                return next(new errorHandler_1.ErrorHandler("Email already in use", statusCodes_1.StatusCodes.CONFLICT));
            }
        }
        if (validatedData.aadharNo) {
            const existingAadhar = await (0, employeeService_1.getEmployeeByAadhar)(validatedData.aadharNo);
            if (existingAadhar && existingAadhar.id !== id) {
                return next(new errorHandler_1.ErrorHandler("Aadhar number already exists", statusCodes_1.StatusCodes.CONFLICT));
            }
        }
        if (validatedData.voterId) {
            const existingVoter = await (0, employeeService_1.getEmployeeByVoterId)(validatedData.voterId);
            if (existingVoter && existingVoter.id !== id) {
                return next(new errorHandler_1.ErrorHandler("Voter ID already exists", statusCodes_1.StatusCodes.CONFLICT));
            }
        }
        const updatedEmployee = await (0, employeeService_1.updateEmployee)(id, validatedData);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: statusCodes_1.StatusCodes.OK,
            message: "Employee updated successfully",
            data: updatedEmployee,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEmployeeRecord = updateEmployeeRecord;
//  DELETE EMPLOYEE
exports.deleteEmployeeRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const existingEmployee = await (0, employeeService_1.getEmployeeById)(id);
    if (!existingEmployee) {
        return next(new errorHandler_1.ErrorHandler("Employee not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    if (existingEmployee.photoUrl) {
        await (0, cloudinaryUploader_1.deleteFromCloudinary)(existingEmployee.photoUrl);
    }
    const deleted = await (0, employeeService_1.deleteEmployee)(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Employee deleted successfully",
    });
});
