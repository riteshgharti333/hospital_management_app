"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBillRecord = exports.updateBillRecord = exports.getBillRecordById = exports.getAllBillRecords = exports.createBillRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const billService_1 = require("../../services/transectionService/billService");
const schemas_1 = require("@hospital/schemas");
exports.createBillRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.billSchema.parse(req.body);
    const bill = await (0, billService_1.createBill)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Bill created successfully",
        data: bill,
    });
});
exports.getAllBillRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const mobile = req.query.mobile;
    const bills = mobile
        ? await (0, billService_1.getBillsByPatient)(mobile)
        : await (0, billService_1.getAllBills)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: mobile
            ? `Bills for patient ${mobile} fetched`
            : "All bills fetched",
        data: bills,
    });
});
exports.getBillRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const bill = await (0, billService_1.getBillById)(id);
    if (!bill) {
        return next(new errorHandler_1.ErrorHandler("Bill not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill details fetched",
        data: bill,
    });
});
exports.updateBillRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.billSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedBill = await (0, billService_1.updateBill)(id, validatedData);
    if (!updatedBill) {
        return next(new errorHandler_1.ErrorHandler("Bill not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill updated successfully",
        data: updatedBill,
    });
});
exports.deleteBillRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedBill = await (0, billService_1.deleteBill)(id);
    if (!deletedBill) {
        return next(new errorHandler_1.ErrorHandler("Bill not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Bill deleted successfully",
        data: deletedBill,
    });
});
