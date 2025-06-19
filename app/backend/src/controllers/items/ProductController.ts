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

export const createProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = productSchema.parse(req.body);
    // Ensure all required fields for ProductInput are present
    const productInput = {
      ...validated,
      brand: req.body.brand,
      category: req.body.category,
      hsnCode: req.body.hsnCode,
      gstPercentage: req.body.gstPercentage,
    };
    const product = await createProduct(productInput);
    
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Product created successfully",
      data: product,
    });
  }
);

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

export const updateProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const partialSchema = productSchema.partial();
    const validatedData = partialSchema.parse(req.body);

    const updatedProduct = await updateProduct(id, validatedData);
    if (!updatedProduct) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  }
);

export const deleteProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
      return next(new ErrorHandler("Product not found", StatusCodes.NOT_FOUND));
    }

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  }
);