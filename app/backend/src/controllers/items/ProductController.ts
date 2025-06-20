import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { catchAsyncError } from "../../middlewares/catchAsyncError";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} from "../../services/itemService/productService";
import { productSchema } from "@hospital/schemas";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinaryUploader";

// ✅ CREATE
export const createProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let uploadedLogoUrl: string | undefined;

    if (req.file) {
      uploadedLogoUrl = await uploadToCloudinary(req.file.buffer);
    }

    const validated = productSchema.parse({
      ...req.body,
      categoryLogo: uploadedLogoUrl, // ✅ attach cloudinary URL
    });

    const product = await createProduct(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Product created successfully",
      data: product,
    });
  }
);

// ✅ GET ALL
export const getAllProductRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const parentCategory = req.query.parentCategory as string | undefined;
    const subCategory = req.query.subCategory as string | undefined;

    const products = parentCategory
      ? await getProductsByCategory(parentCategory)
      : await getAllProducts();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: parentCategory
        ? subCategory
          ? `Products in ${parentCategory} > ${subCategory} fetched`
          : `Products in ${parentCategory} category fetched`
        : "All products fetched",
      data: products,
    });
  }
);

// ✅ GET BY ID
export const getProductRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const product = await getProductById(id);
    if (!product) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product details fetched",
      data: product,
    });
  }
);

// ✅ UPDATE
export const updateProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const existing = await getProductById(id);
    if (!existing) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    let uploadedLogoUrl: string | undefined;

    if (req.file) {
      // ❌ delete old logo
      if (existing.categoryLogo) {
        await deleteFromCloudinary(existing.categoryLogo);
      }
      uploadedLogoUrl = await uploadToCloudinary(req.file.buffer);
    }

    const partialSchema = productSchema.partial();
    const validated = partialSchema.parse({
      ...req.body,
      categoryLogo: uploadedLogoUrl ?? req.body.categoryLogo ?? undefined,
    });

    const updated = await updateProduct(id, validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product updated successfully",
      data: updated,
    });
  }
);

// ✅ DELETE
export const deleteProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const product = await getProductById(id);
    if (!product) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    // ✅ Delete file from Cloudinary
    if (product.categoryLogo) {
      await deleteFromCloudinary(product.categoryLogo);
    }

    const deletedProduct = await deleteProduct(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  }
);
