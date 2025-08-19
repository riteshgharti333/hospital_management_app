import { z } from "zod";
export declare const admissionFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    sex: z.ZodOptional<z.ZodEnum<["M", "F", "Other"]>>;
    bloodGroup: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
}, "strip", z.ZodTypeAny, {
    fromDate?: string | undefined;
    toDate?: string | undefined;
    sex?: "M" | "F" | "Other" | undefined;
    bloodGroup?: string | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}, {
    fromDate?: string | undefined;
    toDate?: string | undefined;
    sex?: "M" | "F" | "Other" | undefined;
    bloodGroup?: string | undefined;
    cursor?: string | undefined;
    limit?: string | undefined;
}>;
