import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ErrorHandler } from "./errorHandler";
import mongoose from "mongoose";
import { Prisma } from "@prisma/client";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message: string | string[] = "Internal Server Error";

  // ZOD Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
  }
  // Custom ErrorHandler
  else if (err instanceof ErrorHandler) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Mongoose Validation
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors).map((val: any) => val.message);
  }
  // Duplicate Key Error (for Mongoose)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field: ${field}`;
  }
  // Prisma Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      // Foreign key constraint failed
      case 'P2003':
        statusCode = 409;
        const foreignKeyField = err.meta?.field_name || err.meta?.constraint;
        message = `Cannot delete record because it is referenced by another record (${foreignKeyField})`;
        break;
      
      // Record not found
      case 'P2001':
      case 'P2025':
        statusCode = 404;
        message = `Record not found`;
        break;
      
      // Unique constraint failed
      case 'P2002':
        statusCode = 409;
        const uniqueField = err.meta?.target;
        message = `Duplicate field value: ${uniqueField}`;
        break;
      
      // Required relation violation
      case 'P2011':
        statusCode = 400;
        message = `Required field is null: ${err.meta?.constraint}`;
        break;
      
      // Invalid data type
      case 'P2006':
        statusCode = 400;
        message = `Invalid data type for field: ${err.meta?.field_name}`;
        break;
      
      // Input value too long
      case 'P2000':
        statusCode = 400;
        message = `Input value too long for field: ${err.meta?.column_name}`;
        break;
      
      // Database connection error
      case 'P1001':
      case 'P1002':
        statusCode = 503;
        message = `Database connection error. Please try again later.`;
        break;
      
      // Default Prisma error
      default:
        statusCode = 400;
        message = `Database error: ${err.message}`;
        break;
    }
  }
  // Prisma Client Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = `Invalid data provided: ${err.message}`;
  }
  // Prisma Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;
    message = `Database initialization error. Please check database connection.`;
  }
  // Prisma Rust Panic (rare)
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    message = `Unexpected database error. Please contact support.`;
    console.error("Prisma Rust Panic:", err.message);
  }
  else {
    console.error("Unhandled Error 💥", err);
  }

  // Log detailed error for debugging (optional)
  if (statusCode === 500) {
    console.error("Detailed error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
};