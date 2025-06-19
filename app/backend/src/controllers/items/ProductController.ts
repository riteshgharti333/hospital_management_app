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
  getProductByCode,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
} from "../../services/itemService/productService";

import {productSchema} from "@hospital/schemas"


export const createProductRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validated = productSchema.parse(req.body);

    // Check if product code already exists
    const existingProduct = await getProductByCode(validated.productCode);
    if (existingProduct) {
      return next(
        new ErrorHandler(
          "Product with this code already exists",
          StatusCodes.CONFLICT
        )
      );
    }

    const product = await createProduct(validated);
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
      ? await getProductsByCategory(parentCategory, subCategory)
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

    // Check if updating product code to an existing one
    if (validatedData.productCode) {
      const existingProduct = await getProductByCode(validatedData.productCode);
      if (existingProduct && existingProduct.id !== id) {
        return next(
          new ErrorHandler(
            "Another product with this code already exists",
            StatusCodes.CONFLICT
          )
        );
      }
    }

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