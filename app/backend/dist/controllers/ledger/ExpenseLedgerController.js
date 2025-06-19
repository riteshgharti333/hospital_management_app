"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpenseRecord = exports.updateExpenseRecord = exports.getExpenseSummary = exports.getExpenseRecordById = exports.getAllExpenseRecords = exports.createExpenseRecord = void 0;
const catchAsyncError_1 = require("../../middlewares/catchAsyncError");
const errorHandler_1 = require("../../middlewares/errorHandler");
const sendResponse_1 = require("../../utils/sendResponse");
const statusCodes_1 = require("../../constants/statusCodes");
const expenseLedgerService_1 = require("../../services/ledgerService/expenseLedgerService");
const schemas_1 = require("@hospital/schemas");
exports.createExpenseRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const validated = schemas_1.expenseLedgerSchema.parse({
        ...req.body,
        date: new Date(req.body.date)
    });
    const entry = await (0, expenseLedgerService_1.createExpenseEntry)(validated);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.CREATED,
        message: "Expense record created successfully",
        data: entry,
    });
});
exports.getAllExpenseRecords = (0, catchAsyncError_1.catchAsyncError)(async (req, res) => {
    const filters = {
        expenseCategory: req.query.expenseCategory,
        startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate) : undefined
    };
    const entries = await (0, expenseLedgerService_1.getAllExpenseEntries)(filters);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Expense records fetched successfully",
        data: entries,
    });
});
exports.getExpenseRecordById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const entry = await (0, expenseLedgerService_1.getExpenseEntryById)(id);
    if (!entry) {
        return next(new errorHandler_1.ErrorHandler("Expense record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Expense record details fetched",
        data: entry,
    });
});
exports.getExpenseSummary = (0, catchAsyncError_1.catchAsyncError)(async (_req, res) => {
    const summary = await (0, expenseLedgerService_1.getExpenseSummaryByCategory)();
    const total = await (0, expenseLedgerService_1.getTotalExpenses)();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Expense summary calculated",
        data: { summary, total },
    });
});
exports.updateExpenseRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const partialSchema = schemas_1.expenseLedgerSchema.partial();
    const validatedData = partialSchema.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
    });
    const updatedEntry = await (0, expenseLedgerService_1.updateExpenseEntry)(id, validatedData);
    if (!updatedEntry) {
        return next(new errorHandler_1.ErrorHandler("Expense record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Expense record updated successfully",
        data: updatedEntry,
    });
});
exports.deleteExpenseRecord = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next(new errorHandler_1.ErrorHandler("Invalid ID", statusCodes_1.StatusCodes.BAD_REQUEST));
    }
    const deletedEntry = await (0, expenseLedgerService_1.deleteExpenseEntry)(id);
    if (!deletedEntry) {
        return next(new errorHandler_1.ErrorHandler("Expense record not found", statusCodes_1.StatusCodes.NOT_FOUND));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: statusCodes_1.StatusCodes.OK,
        message: "Expense record deleted successfully",
        data: deletedEntry,
    });
});
