import { z } from "zod";

/**
 * Zod schema to strictly validate ISO 8601 date strings.
 * e.g. "2025-05-28T14:00:00Z" or "2025-05-28"
 */
export const isoDateString = z
  .string({
    required_error: "Date is required",
  })
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Must be a valid ISO date string.",
  });
