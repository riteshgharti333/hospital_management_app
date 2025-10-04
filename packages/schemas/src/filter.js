"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.admissionFilterSchema = void 0;
const zod_1 = require("zod");
exports.admissionFilterSchema = zod_1.z.object({
    fromDate: zod_1.z.string().datetime().optional(),
    toDate: zod_1.z.string().datetime().optional(),
    sex: zod_1.z.enum(["M", "F", "Other"]).optional(),
    bloodGroup: zod_1.z.string().optional(),
    cursor: zod_1.z.string().optional(),
    limit: zod_1.z.string().transform(Number).optional(),
});
