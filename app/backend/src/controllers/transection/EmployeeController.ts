import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../../middlewares/errorHandler";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "../../constants/statusCodes";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  getEmployeeByAadhar,
  getEmployeeByVoterId,
  getEmployeesByDepartment,
  updateEmployee,
  deleteEmployee,
} from "../../services/transectionService/employeeService";
import { employeeSchema } from "@hospital/schemas";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinaryUploader";
import { catchAsyncError } from "../../middlewares/catchAsyncError";

// CREATE EMPLOYEE
export const createEmployeeRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let uploadedUrl: string | undefined;

    if (req.file) {
      uploadedUrl = await uploadToCloudinary(req.file.buffer);
    }

    const validated = employeeSchema.parse({
      ...req.body,
      photoUrl: uploadedUrl,
    });

    // Check for unique fields
    if (validated.email) {
      const existingEmail = await getEmployeeByEmail(validated.email);
      if (existingEmail) {
        return next(new ErrorHandler("Email already in use", StatusCodes.CONFLICT));
      }
    }
    if (validated.aadharNo) {
      const existingAadhar = await getEmployeeByAadhar(validated.aadharNo);
      if (existingAadhar) {
        return next(new ErrorHandler("Aadhar number already exists", StatusCodes.CONFLICT));
      }
    }
    if (validated.voterId) {
      const existingVoter = await getEmployeeByVoterId(validated.voterId);
      if (existingVoter) {
        return next(new ErrorHandler("Voter ID already exists", StatusCodes.CONFLICT));
      }
    }

    const employee = await createEmployee(validated);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL EMPLOYEES or FILTER BY DEPARTMENT
export const getAllEmployeeRecords = catchAsyncError(
  async (req: Request, res: Response) => {
    const department = req.query.department as string | undefined;
    const employees = department
      ? await getEmployeesByDepartment(department)
      : await getAllEmployees();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: department ? `Employees in ${department} department fetched` : "All employees fetched",
      data: employees,
    });
  }
);

// GET SINGLE EMPLOYEE BY ID
export const getEmployeeRecordById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }
    const employee = await getEmployeeById(id);
    if (!employee) {
      return next(new ErrorHandler("Employee not found", StatusCodes.NOT_FOUND));
    }
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Employee record fetched",
      data: employee,
    });
  }
);

// UPDATE EMPLOYEE
export const updateEmployeeRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const existingEmployee = await getEmployeeById(id);
    if (!existingEmployee) {
      return next(new ErrorHandler("Employee not found", StatusCodes.NOT_FOUND));
    }

    let uploadedUrl: string | undefined;
    if (req.file) {
      if (existingEmployee.photoUrl) {
        await deleteFromCloudinary(existingEmployee.photoUrl);
      }
      uploadedUrl = await uploadToCloudinary(req.file.buffer);
    }

    const partialSchema = employeeSchema.partial();
    const validatedData = partialSchema.parse({
      ...req.body,
      photoUrl: uploadedUrl ?? req.body.photoUrl ?? undefined,
    });

    // Check for unique fields during update
    if (validatedData.email) {
      const existingEmail = await getEmployeeByEmail(validatedData.email);
      if (existingEmail && existingEmail.id !== id) {
        return next(new ErrorHandler("Email already in use", StatusCodes.CONFLICT));
      }
    }
    if (validatedData.aadharNo) {
      const existingAadhar = await getEmployeeByAadhar(validatedData.aadharNo);
      if (existingAadhar && existingAadhar.id !== id) {
        return next(new ErrorHandler("Aadhar number already exists", StatusCodes.CONFLICT));
      }
    }
    if (validatedData.voterId) {
      const existingVoter = await getEmployeeByVoterId(validatedData.voterId);
      if (existingVoter && existingVoter.id !== id) {
        return next(new ErrorHandler("Voter ID already exists", StatusCodes.CONFLICT));
      }
    }

    const updatedEmployee = await updateEmployee(id, validatedData);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
};

//  DELETE EMPLOYEE
export const deleteEmployeeRecord = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new ErrorHandler("Invalid ID", StatusCodes.BAD_REQUEST));
    }

    const existingEmployee = await getEmployeeById(id);
    if (!existingEmployee) {
      return next(new ErrorHandler("Employee not found", StatusCodes.NOT_FOUND));
    }
    
    if (existingEmployee.photoUrl) {
        await deleteFromCloudinary(existingEmployee.photoUrl);
    }

    const deleted = await deleteEmployee(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Employee deleted successfully",
    });
  }
);