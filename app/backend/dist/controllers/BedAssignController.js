"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBedAssignmentRecord = exports.dischargePatientFromBed = exports.updateBedAssignmentRecord = exports.getBedAssignmentRecordById = exports.getAllBedAssignmentRecords = exports.createBedAssignmentRecord = void 0;
const catchAsyncError_1 = require("../middlewares/catchAsyncError");
const errorHandler_1 = require("../middlewares/errorHandler");
const sendResponse_1 = require("../utils/sendResponse");
const statusCodes_1 = require("../constants/statusCodes");
const bedAssignService_1 = require("../services/bedAssignService");
const schemas_1 = require("@hospital/schemas");
exports.createBedAssignmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.bedAssignmentSchema.parse({
        ...req.body,
        allocateDate: new Date(req.body.allocateDate)
    });
    const assignment = await (0, bedAssignService_1.createBedAssignment)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Bed assignment created successfully",
        data: assignment,
    });
});
exports.getAllBedAssignmentRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const { ward, bed, status } = req.query;
    let assignments;
    if (ward) {
        assignments = await (0, bedAssignService_1.getAssignmentsByWard)(ward);
    }
    else if (bed) {
        assignments = await (0, bedAssignService_1.getAssignmentsByBed)(bed);
    }
    else if (status === "Active") {
        assignments = await (0, bedAssignService_1.getActiveAssignments)();
    }
    else {
        assignments = await (0, bedAssignService_1.getAllBedAssignments)();
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bed assignments fetched successfully",
        data: assignments,
    });
});
exports.getBedAssignmentRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const assignment = await (0, bedAssignService_1.getBedAssignmentById)(id);
    if (!assignment) {
        return next(new errorHandler_1.ErrorHandler("Bed assignment not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bed assignment details fetched",
        data: assignment,
    });
});
exports.updateBedAssignmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.bedAssignmentSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        allocateDate: req.body.allocateDate ? new Date(req.body.allocateDate) : undefined,
        dischargeDate: req.body.dischargeDate ? new Date(req.body.dischargeDate) : undefined
    });
    const updatedAssignment = await (0, bedAssignService_1.updateBedAssignment)(id, validatedData);
    if (!updatedAssignment) {
        return next(new errorHandler_1.ErrorHandler("Bed assignment not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bed assignment updated successfully",
        data: updatedAssignment,
    });
});
exports.dischargePatientFromBed = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const dischargeDate = new Date(req.body.dischargeDate || new Date());
    const dischargedAssignment = await (0, bedAssignService_1.dischargePatient)(id, dischargeDate);
    if (!dischargedAssignment) {
        return next(new errorHandler_1.ErrorHandler("Bed assignment not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Patient discharged successfully",
        data: dischargedAssignment,
    });
});
exports.deleteBedAssignmentRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedAssignment = await (0, bedAssignService_1.deleteBedAssignment)(id);
    if (!deletedAssignment) {
        return next(new errorHandler_1.ErrorHandler("Bed assignment not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bed assignment deleted successfully",
        data: deletedAssignment,
    });
});
