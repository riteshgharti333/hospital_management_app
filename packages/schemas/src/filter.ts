import { z } from "zod";

export const admissionFilterSchema = z.object({
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  sex: z.enum(["M", "F", "Other"]).optional(),
  bloodGroup: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.string().transform(Number).optional(),
});

