// utils/validateWithZod.ts
import { ZodSchema } from "zod";
import { ErrorHandler } from "../middlewares/errorHandler";
import { StatusCodes } from "../constants/statusCodes";

export function validateWithZod<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ErrorHandler(
      result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      StatusCodes.BAD_REQUEST
    );
  }

  return result.data;
}
