import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  getBrandByName,
  updateBrand,
  deleteBrand,
} from "../../services/itemService/brandService";
import { brandSchema } from "@hospital/schemas";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinaryUploader";

export const createBrandRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let uploadedUrl: string | undefined;

    if (req.file) {
      uploadedUrl = await uploadToCloudinary(req.file.buffer);
    }

    const validated = brandSchema.parse({
      ...req.body,
      brandLogo: uploadedUrl,
    });

    const existing = await getBrandByName(validated.brandName);
    if (existing) {
      return next(
        new ErrorHandler(
          "Brand with this name already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const brand = await createBrand(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBrandRecords = catchAsyncError(
  async (_req: Request, res: Response) => {
    const brands = await getAllBrands();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "All brands fetched",
      data: brands,
    });
  }
);

export const getBrandRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const brand = await getBrandById(id);
    if (!brand) {
      return next(new ErrorHandler("Brand not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Brand details fetched",
      data: brand,
    });
  }
);

export const updateBrandRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const existingBrand = await getBrandById(id);
    if (!existingBrand) {
      return next(new ErrorHandler("Brand not found", StatusCodes.NOT_FOUND));
    }

    let uploadedUrl: string | undefined;

    if (req.file) {
      if (existingBrand.brandLogo) {
        await deleteFromCloudinary(existingBrand.brandLogo);
      }
      uploadedUrl = await uploadToCloudinary(req.file.buffer);
    }

    const partialSchema = brandSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      brandLogo: uploadedUrl ?? req.body.brandLogo ?? undefined,
    });

    if (validatedData.brandName) {
      const existing = await getBrandByName(validatedData.brandName);
      if (existing && existing.id !== id) {
        return next(
          new ErrorHandler(
            "Another brand with this name already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

    const updatedBrand = await updateBrand(id, validatedData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  }
);

export const deleteBrandRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const existingBrand = await getBrandById(id);
    if (!existingBrand) {
      return next(new ErrorHandler("Brand not found", StatusCodes.NOT_FOUND));
    }

    if (existingBrand.brandLogo) {
      await deleteFromCloudinary(existingBrand.brandLogo);
    }

    await deleteBrand(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Brand deleted successfully",
    });
  }
);