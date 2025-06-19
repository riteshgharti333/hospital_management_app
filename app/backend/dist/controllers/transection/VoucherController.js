"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVoucherRecord = exports.updateVoucherRecord = exports.getVoucherRecordById = exports.getAllVoucherRecords = exports.createVoucherRecord = void 0;
const zod_1 = require("zod");
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const voucherService_1 = require("../../services/transectionService/voucherService");
const voucherSchema = zod_1.z.object({
    voucherDate: zod_1.z.string().transform((val) => new Date(val)),
    paymentFor: zod_1.z.string().min(1, "Payment for is required"),
    voucherType: zod_1.z.enum(["Payment", "Receipt", "Journal"]),
    vendorName: zod_1.z.string().min(1, "Vendor name is required"),
    paymentDate: zod_1.z.string().transform((val) => new Date(val)),
    amount: zod_1.z.number().min(0.01, "Amount must be positive"),
    paymentMode: zod_1.z.enum(["Cash", "Cheque", "Bank Transfer", "Card", "Online"]),
    referenceNo: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["Pending", "Approved", "Rejected", "Paid"]).optional().default("Pending"),
});
exports.createVoucherRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = voucherSchema.parse(req.body);
    const voucher = await (0, voucherService_1.createVoucher)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Voucher created successfully",
        data: voucher,
    });
});
exports.getAllVoucherRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const vendorName = req.query.vendor;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    let vouchers;
    if (vendorName) {
        vouchers = await (0, voucherService_1.getVouchersByVendor)(vendorName);
    }
    else if (startDate && endDate) {
        vouchers = await (0, voucherService_1.getVouchersByDateRange)(new Date(startDate), new Date(endDate));
    }
    else {
        vouchers = await (0, voucherService_1.getAllVouchers)();
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: vendorName
            ? `Vouchers for vendor ${vendorName} fetched`
            : startDate && endDate
                ? `Vouchers between ${startDate} and ${endDate} fetched`
                : "All vouchers fetched",
        data: vouchers,
    });
});
exports.getVoucherRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const voucher = await (0, voucherService_1.getVoucherById)(id);
    if (!voucher) {
        return next(new errorHandler_1.ErrorHandler("Voucher not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Voucher details fetched",
        data: voucher,
    });
});
exports.updateVoucherRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = voucherSchema.partial();
    const validatedData = partialSchema.parse(req.body);
    const updatedVoucher = await (0, voucherService_1.updateVoucher)(id, validatedData);
    if (!updatedVoucher) {
        return next(new errorHandler_1.ErrorHandler("Voucher not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Voucher updated successfully",
        data: updatedVoucher,
    });
});
exports.deleteVoucherRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedVoucher = await (0, voucherService_1.deleteVoucher)(id);
    if (!deletedVoucher) {
        return next(new errorHandler_1.ErrorHandler("Voucher not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Voucher deleted successfully",
        data: deletedVoucher,
    });
});
