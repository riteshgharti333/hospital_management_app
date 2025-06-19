import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../middlewares/errorHandler";
import { sendResponse } from "../utils/sendResponse";
import { StatusCodes } from "../constants/statusCodes";
import {
  createXrayReport,
  getAllXrayReports,
  getXrayReportById,
  getFinancialSummary,
  getDoctorWiseSummary,
  updateXrayReport,
  deleteXrayReport,
} from "../services/xrayService";
import { xrayReportSchema } from "@hospital/schemas";

export const createXrayReportRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = xrayReportSchema.parse({
      ...req.body,
      billDate: new Date(req.body.billDate),
      testDate: new Date(req.body.testDate),
      reportDate: new Date(req.body.reportDate),
    });

    // Validate netBillAmount calculation
    const calculatedNet =
      validated.billAmount * (1 - validated.discountPercent / 100);
    if (Math.abs(calculatedNet - validated.netBillAmount) > 0.01) {
      return next(
        new ErrorHandler(
          "Net bill amount calculation doesn't match",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Validate doctorEarning calculation
    const calculatedEarning =
      validated.netBillAmount * (validated.commissionPercent / 100);
    if (Math.abs(calculatedEarning - validated.doctorEarning) > 0.01) {
      return next(
        new ErrorHandler(
          "Doctor earning calculation doesn't match",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const report = await createXrayReport(validated);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "X-ray report record created successfully",
      data: report,
    });
  }
);

export const getAllXrayReportRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const filters = {
      patientMobile: req.query.patientMobile as string | undefined,
      patientName: req.query.patientName as string | undefined,
      referredDoctor: req.query.referredDoctor as string | undefined,
      startDate: req.query.startDate
        ? new Date(req.query.startDate as string)
        : undefined,
      endDate: req.query.endDate
        ? new Date(req.query.endDate as string)
        : undefined,
      department: req.query.department as string | undefined,
    };

    const reports = await getAllXrayReports(filters);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "X-ray reports fetched successfully",
      data: reports,
    });
  }
);

export const getXrayReportRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const report = await getXrayReportById(id);
    if (!report) {
      return next(
        new ErrorHandler("X-ray report not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "X-ray report details fetched",
      data: report,
    });
  }
);

export const getFinancialSummaryReport = catchAsyncError(
  async (_req: Request, res: Response) => {
    const summary = await getFinancialSummary();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Financial summary calculated",
      data: summary,
    });
  }
);

export const getDoctorWiseSummaryReport = catchAsyncError(
  async (_req: Request, res: Response) => {
    const summary = await getDoctorWiseSummary();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Doctor-wise summary calculated",
      data: summary,
    });
  }
);

export const updateXrayReportRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = xrayReportSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      billDate: req.body.billDate ? new Date(req.body.billDate) : undefined,
      testDate: req.body.testDate ? new Date(req.body.testDate) : undefined,
      reportDate: req.body.reportDate
        ? new Date(req.body.reportDate)
        : undefined,
    });

    const updatedReport = await updateXrayReport(id, validatedData);
    if (!updatedReport) {
      return next(
        new ErrorHandler("X-ray report not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "X-ray report updated successfully",
      data: updatedReport,
    });
  }
);

export const deleteXrayReportRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedReport = await deleteXrayReport(id);
    if (!deletedReport) {
      return next(
        new ErrorHandler("X-ray report not found", StatusCodes.NOT_FOUND)
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "X-ray report deleted successfully",
      data: deletedReport,
    });
  }
);
