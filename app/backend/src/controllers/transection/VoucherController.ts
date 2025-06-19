import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  getVouchersByVendor,
  getVouchersByDateRange,
  updateVoucher,
  deleteVoucher,
} from "../../services/transectionService/voucherService";

const voucherSchema = z.object({
  voucherDate: z.string().transform((val) => new Date(val)),
  paymentFor: z.string().min(1, "Payment for is required"),
  voucherType: z.enum(["Payment", "Receipt", "Journal"]),
  vendorName: z.string().min(1, "Vendor name is required"),
  paymentDate: z.string().transform((val) => new Date(val)),
  amount: z.number().min(0.01, "Amount must be positive"),
  paymentMode: z.enum(["Cash", "Cheque", "Bank Transfer", "Card", "Online"]),
  referenceNo: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["Pending", "Approved", "Rejected", "Paid"]).optional().default("Pending"),
});

export const createVoucherRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = voucherSchema.parse(req.body);
    const voucher = await createVoucher(validated);
    
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Voucher created successfully",
      data: voucher,
    });
  }
);

export const getAllVoucherRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const vendorName = req.query.vendor as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    
    let vouchers;
    
    if (vendorName) {
      vouchers = await getVouchersByVendor(vendorName);
    } else if (startDate && endDate) {
      vouchers = await getVouchersByDateRange(new Date(startDate), new Date(endDate));
    } else {
      vouchers = await getAllVouchers();
    }
      
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: vendorName
        ? `Vouchers for vendor ${vendorName} fetched`
        : startDate && endDate
        ? `Vouchers between ${startDate} and ${endDate} fetched`
        : "All vouchers fetched",
      data: vouchers,
    });
  }
);

export const getVoucherRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const voucher = await getVoucherById(id);
    if (!voucher) {
      return next(new ErrorHandler("Voucher not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Voucher details fetched",
      data: voucher,
    });
  }
);

export const updateVoucherRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = voucherSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedVoucher = await updateVoucher(id, validatedData);
    if (!updatedVoucher) {
      return next(new ErrorHandler("Voucher not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Voucher updated successfully",
      data: updatedVoucher,
    });
  }
);

export const deleteVoucherRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedVoucher = await deleteVoucher(id);
    if (!deletedVoucher) {
      return next(new ErrorHandler("Voucher not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Voucher deleted successfully",
      data: deletedVoucher,
    });
  }
);