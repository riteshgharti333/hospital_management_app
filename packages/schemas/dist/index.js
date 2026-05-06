"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moneyReceiptFilterSchema = exports.billFilterSchema = exports.doctorLedgerFilterSchema = exports.patientLedgerFilterSchema = exports.doctorFilterSchema = exports.nurseFilterSchema = exports.prescriptionFilterSchema = exports.appointmentFilterSchema = exports.departmentFilterSchema = exports.patientFilterSchema = exports.birthFilterSchema = exports.admissionFilterSchema = exports.bankFilterSchema = exports.cashFilterSchema = exports.ledgerFilterSchema = exports.ledgerSchema = exports.REFERENCE_TYPES = exports.ENTITY_TYPES = exports.PaymentModeEnum = exports.AmountTypeEnum = exports.bankSchema = exports.cashSchema = exports.moneyReceiptSchema = exports.billSchema = exports.billItemSchema = exports.billStatusOptions = exports.services = exports.CompanyEnum = exports.prescriptionSchema = exports.medicineSchema = exports.PrescriptionStatusEnum = exports.patientSchema = exports.nurseSchema = exports.doctorSchema = exports.appointmentSchema = exports.AppointmentStatus = exports.departmentSchema = exports.DepartmentNameEnum = exports.DepartmentStatusEnum = exports.birthSchema = exports.admissionSchema = exports.loginSchema = exports.registerSchema = exports.changePasswordSchema = void 0;
const zod_1 = require("zod");
// AUTHENTICATION SCHEMAS
exports.changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must not exceed 64 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: zod_1.z.string().min(1, "Confirm password is required"),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name is too short").max(50).optional(),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(64)
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/[a-z]/, "Must include at least one lowercase letter")
        .regex(/[0-9]/, "Must include at least one number")
        .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(1, "Password is required"),
});
// ADMISSION SCHEMAS
const admissionStatus = zod_1.z.enum(["ACTIVE", "DISCHARGED", "CANCELLED"]);
exports.admissionSchema = zod_1.z.object({
    patientId: zod_1.z.number().int().positive("Patient ID is required"),
    status: admissionStatus.default("ACTIVE"),
    doctorId: zod_1.z.number().int().positive("Doctor ID is required"),
    admissionDate: zod_1.z.coerce.date(),
    dischargeDate: zod_1.z.preprocess((val) => (val === "" || val === null ? undefined : val), zod_1.z.coerce.date().optional()),
});
// BIRTH SCHEMAS
exports.birthSchema = zod_1.z.object({
    birthTime: zod_1.z.string().min(1, "Birth time is required"),
    birthDate: zod_1.z
        .string()
        .min(1, "Birth date is required")
        .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid date format",
    })
        .transform((val) => new Date(val)),
    babySex: zod_1.z.string().min(1, "Baby's sex is required"),
    babyWeightKg: zod_1.z.number().positive("Weight must be positive"),
    fathersName: zod_1.z.string().min(1, "Father's name is required"),
    mothersName: zod_1.z.string().min(1, "Mother's name is required"),
    mobileNumber: zod_1.z.string().min(10, "Mobile number must be at least 10 digits"),
    deliveryType: zod_1.z.string().min(1, "Delivery type is required"),
    placeOfBirth: zod_1.z.string().min(1, "Place of birth is required"),
    attendantsName: zod_1.z.string().min(1, "Attendant's name is required"),
});
// DEPARTMENT SCHEMAS
exports.DepartmentStatusEnum = zod_1.z.enum(["ACTIVE", "INACTIVE"]);
exports.DepartmentNameEnum = zod_1.z.enum([
    "CARDIOLOGY",
    "NEUROLOGY",
    "ORTHOPEDICS",
    "PEDIATRICS",
    "DERMATOLOGY",
    "GENERAL",
]);
exports.departmentSchema = zod_1.z.object({
    name: exports.DepartmentNameEnum,
    description: zod_1.z.string().optional(),
    doctorId: zod_1.z.coerce.number().int().positive("Valid doctor ID is required"),
    status: exports.DepartmentStatusEnum.optional().default("ACTIVE"),
});
// APPOINTMENT SCHEMAS
exports.AppointmentStatus = zod_1.z.enum(["BOOKED", "CANCELLED", "EXPIRED"]);
exports.appointmentSchema = zod_1.z.object({
    appointmentDate: zod_1.z
        .string()
        .min(1, "Appointment date is required")
        .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid date format",
    })
        .transform((val) => new Date(val)),
    appointmentTime: zod_1.z.string().min(1, "Appointment time is required"),
    doctorId: zod_1.z
        .number({
        required_error: "Doctor is required",
        invalid_type_error: "Doctor ID must be a number",
    })
        .int("Doctor ID must be an integer")
        .positive("Doctor ID must be positive"),
    status: exports.AppointmentStatus.optional(),
});
// DOCTOR SCHEMAS
exports.doctorSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    mobileNumber: zod_1.z
        .string()
        .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),
    email: zod_1.z.string().email("Invalid email format"),
    qualification: zod_1.z.string().min(1, "Qualification is required"),
    designation: zod_1.z.string().min(1, "Designation is required"),
    specialization: zod_1.z.string().min(1, "Specialization is required"),
    status: zod_1.z.string().optional().default("Active"),
});
// NURSE SCHEMAS
exports.nurseSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    mobileNumber: zod_1.z.string().min(10, "Mobile number must be at least 10 digits"),
    department: zod_1.z.string().min(1, "Department is required"),
    address: zod_1.z.string().min(1, "Address is required"),
    email: zod_1.z.string().email("Invalid email format"),
    shift: zod_1.z.string().min(1, "Shift is required"),
    status: zod_1.z.string().optional().default("Active"),
});
// PATIENT SCHEMAS
exports.patientSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required").trim(),
    dateOfBirth: zod_1.z.coerce.date({
        required_error: "Date of birth is required",
    }),
    gender: zod_1.z.string().min(1, "Gender is required"),
    mobileNumber: zod_1.z
        .string()
        .regex(/^\d{10}$/, "Mobile number must be 10 digits")
        .optional(),
    aadhaarNumber: zod_1.z
        .string()
        .regex(/^\d{12}$/, "Aadhaar must be 12 digits")
        .optional(),
    address: zod_1.z.string().min(1, "Address is required").trim(),
});
// PRESCRIPTION SCHEMAS
exports.PrescriptionStatusEnum = zod_1.z.enum([
    "ACTIVE",
    "COMPLETED",
    "CANCELLED",
]);
exports.medicineSchema = zod_1.z.object({
    medicineName: zod_1.z
        .string({
        required_error: "Medicine name is required",
        invalid_type_error: "Medicine name must be a string",
    })
        .min(1, "Medicine name cannot be empty"),
    dosage: zod_1.z
        .string({
        required_error: "Dosage is required",
    })
        .min(1, "Dosage cannot be empty"),
    frequency: zod_1.z
        .string({
        required_error: "Frequency is required",
    })
        .min(1, "Frequency cannot be empty"),
    duration: zod_1.z
        .string({
        required_error: "Duration is required",
    })
        .min(1, "Duration cannot be empty"),
    instructions: zod_1.z
        .string({
        invalid_type_error: "Instructions must be a string",
    })
        .optional(),
});
exports.prescriptionSchema = zod_1.z.object({
    admissionId: zod_1.z.coerce.number({
        required_error: "Admission ID is required",
        invalid_type_error: "Admission ID must be a number",
    }),
    prescriptionDate: zod_1.z
        .string({
        invalid_type_error: "Date must be a valid string",
    })
        .optional(),
    prescriptionDoc: zod_1.z
        .string({
        invalid_type_error: "Prescription doc must be a string",
    })
        .url("Invalid URL")
        .optional(),
    notes: zod_1.z
        .string({
        invalid_type_error: "Notes must be a string",
    })
        .max(1000, "Notes cannot exceed 1000 characters")
        .optional(),
    status: exports.PrescriptionStatusEnum.optional().default("ACTIVE"),
    medicines: zod_1.z
        .array(exports.medicineSchema, {
        required_error: "At least one medicine is required",
    })
        .min(1, "At least one medicine is required"),
});
// TRANSACTION SCHEMAS
exports.CompanyEnum = zod_1.z.enum([
    "Sun Pharma",
    "Cipla",
    "Dr. Reddy's",
    "Abbott",
    "Mankind Pharma",
    "Zydus Cadila",
    "Alkem Laboratories",
    "Torrent Pharmaceuticals",
]);
exports.services = zod_1.z.enum([
    "Paracetamol 500mg",
    "Amoxicillin 250mg",
    "Omeprazole 20mg",
    "Metformin 500mg",
    "Atorvastatin 10mg",
    "CBC Test",
    "X-Ray Chest",
    "Ultrasound",
    "Consultation Fee",
    "Room Charges",
    "Nursing Care",
    "IV Fluids",
]);
exports.billStatusOptions = zod_1.z.enum([
    "Pending",
    "PartiallyPaid",
    "Paid",
    "Cancelled",
    "Refunded",
]);
exports.billItemSchema = zod_1.z.object({
    company: exports.CompanyEnum,
    itemOrService: exports.services,
    quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
    mrp: zod_1.z.number().min(0, "MRP must be a non-negative number"),
    totalAmount: zod_1.z.number().min(0).optional(),
});
exports.billSchema = zod_1.z.object({
    billDate: zod_1.z.coerce.date(),
    billType: zod_1.z.string().min(1, "Bill type is required"),
    totalAmount: zod_1.z.number().min(0, "Total amount must be positive"),
    admissionId: zod_1.z.number().min(1, "Admission ID is required"),
    patientId: zod_1.z.number().min(1, "Patient ID is required"),
    status: exports.billStatusOptions.default("Pending"),
    billItems: zod_1.z
        .array(exports.billItemSchema)
        .min(1, "At least one bill item is required"),
});
exports.moneyReceiptSchema = zod_1.z.object({
    date: zod_1.z.string().transform((val) => new Date(val)),
    admissionId: zod_1.z.number().min(1, "Admission ID is required"),
    patientId: zod_1.z.number().min(1, "Patient ID is required"),
    amount: zod_1.z.coerce.number().min(0.01, "Amount must be greater than 0"),
    paymentMode: zod_1.z.enum(["Cash", "Cheque", "Card", "Online Transfer", "Other"]),
    remarks: zod_1.z.string().optional(),
    receivedBy: zod_1.z.string().min(1, "Received by is required"),
    status: zod_1.z
        .enum(["Active", "Cancelled", "Refunded"])
        .optional()
        .default("Active"),
});
const BankeEnum = zod_1.z.enum(["ACTIVE", "INACTIVE"]);
// CASH & BANK SCHEMAS
exports.cashSchema = zod_1.z.object({
    cashName: zod_1.z.string().min(2, "Cash name is required").max(100),
    status: BankeEnum,
});
exports.bankSchema = zod_1.z.object({
    bankName: zod_1.z.string().min(2, "Bank name is required").max(100),
    accountNo: zod_1.z.string().min(6, "Account number is required").max(50),
    ifscCode: zod_1.z.string().min(4, "Invalid IFSC").max(20).optional(),
    status: BankeEnum,
});
// LEDGER SCHEMAS
exports.AmountTypeEnum = zod_1.z.enum(["CREDIT", "DEBIT"]);
exports.PaymentModeEnum = zod_1.z.enum([
    "CASH",
    "CARD",
    "UPI",
    "BANK_TRANSFER",
    "CHEQUE",
]);
exports.ENTITY_TYPES = ["PATIENT", "DOCTOR", "BANK", "CASH"];
exports.REFERENCE_TYPES = [
    "OPD",
    "IPD",
    "PHARMACY",
    "LAB",
    "PROCEDURE",
    "SALARY",
    "EXPENSE",
    "ADVANCE",
    "REFUND",
    "OTHER",
];
const requiredDate = zod_1.z.preprocess((val) => {
    if (val === undefined || val === null || val === "") {
        return undefined;
    }
    return new Date(val);
}, zod_1.z.date({
    required_error: "Date is required",
    invalid_type_error: "Date is required",
}));
exports.ledgerSchema = zod_1.z.object({
    entityType: zod_1.z
        .string({
        required_error: "Entity type is required",
        invalid_type_error: "Entity type must be a valid string",
    })
        .refine((val) => exports.ENTITY_TYPES.includes(val), {
        message: "Invalid entity type. Allowed values are: " + exports.ENTITY_TYPES.join(", "),
    }),
    entityId: zod_1.z.string({
        required_error: "Entity ID is required",
    }),
    transactionDate: requiredDate,
    description: zod_1.z
        .string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
    })
        .min(1, "Description cannot be empty")
        .max(255, "Description cannot exceed 255 characters"),
    amountType: exports.AmountTypeEnum.refine((val) => val !== undefined, {
        message: "Amount type is required (e.g., CREDIT or DEBIT)",
    }),
    amount: zod_1.z.coerce
        .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a valid number",
    })
        .positive("Amount must be greater than 0"),
    paymentMode: exports.PaymentModeEnum.optional(),
    referenceType: zod_1.z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .optional()
        .refine((val) => !val || exports.REFERENCE_TYPES.includes(val), {
        message: "Invalid reference type",
    }),
    referenceId: zod_1.z
        .string({
        invalid_type_error: "Reference ID must be a string",
    })
        .optional(),
    remarks: zod_1.z
        .string({
        invalid_type_error: "Remarks must be a string",
    })
        .max(500, "Remarks cannot exceed 500 characters")
        .optional(),
});
// BASE FILTER SCHEMA
const baseFilterSchema = {
    fromDate: zod_1.z.coerce.date().optional(),
    toDate: zod_1.z.coerce.date().optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(50),
    cursor: zod_1.z.string().optional(),
};
// LEDGER FILTER SCHEMAS
exports.ledgerFilterSchema = zod_1.z.object({
    entityType: zod_1.z.enum(["PATIENT", "DOCTOR", "BANK", "CASH"]).optional(),
    amountType: zod_1.z.enum(["CREDIT", "DEBIT"]).optional(),
    paymentMode: zod_1.z
        .enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"])
        .optional(),
    ...baseFilterSchema,
});
// CASH FILTER SCHEMAS
exports.cashFilterSchema = zod_1.z.object({
    status: BankeEnum.optional(),
    ...baseFilterSchema,
});
// BANK FILTER SCHEMAS
exports.bankFilterSchema = zod_1.z.object({
    status: BankeEnum.optional(),
    ...baseFilterSchema,
});
// ADMISSION FILTER SCHEMAS
exports.admissionFilterSchema = zod_1.z.object({
    gender: zod_1.z.enum(["Male", "Female", "Other"]).optional(),
    ...baseFilterSchema,
});
// BIRTH FILTER SCHEMAS
exports.birthFilterSchema = zod_1.z.object({
    babySex: zod_1.z.enum(["Male", "Female", "Other"]).optional(),
    deliveryType: zod_1.z.enum(["Normal", "Cesarean", "Forceps", "Vacuum"]).optional(),
    ...baseFilterSchema,
});
// PATIENT FILTER SCHEMAS
exports.patientFilterSchema = zod_1.z.object({
    gender: zod_1.z.enum(["Male", "Female", "Other"]).optional(),
    ...baseFilterSchema,
});
// DEPARTMENT FILTER SCHEMAS
exports.departmentFilterSchema = zod_1.z.object({
    status: exports.DepartmentStatusEnum.optional(),
    ...baseFilterSchema,
});
// APPOINTMENT FILTER SCHEMAS
exports.appointmentFilterSchema = zod_1.z.object({
    department: zod_1.z.string().optional(),
    status: exports.AppointmentStatus.optional(),
    ...baseFilterSchema,
});
exports.prescriptionFilterSchema = zod_1.z.object({
    status: exports.PrescriptionStatusEnum.optional(),
    ...baseFilterSchema,
});
// NURSE FILTER SCHEMAS
exports.nurseFilterSchema = zod_1.z.object({
    shift: zod_1.z.enum(["Day", "Night", "Rotating"]).optional(),
    status: zod_1.z.enum(["Active", "Inactive", "On Leave"]).optional(),
    ...baseFilterSchema,
});
// DOCTOR FILTER SCHEMAS
exports.doctorFilterSchema = zod_1.z.object({
    status: zod_1.z.enum(["Active", "Inactive", "On Leave"]).optional(),
    ...baseFilterSchema,
});
// PATIENT LEDGER FILTER SCHEMAS
exports.patientLedgerFilterSchema = zod_1.z.object({
    amountType: zod_1.z.enum(["CREDIT", "DEBIT"]).optional(),
    paymentMode: zod_1.z
        .enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"])
        .optional(),
    ...baseFilterSchema,
});
// DOCTOR LEDGER FILTER SCHEMAS
exports.doctorLedgerFilterSchema = zod_1.z.object({
    amountType: zod_1.z.enum(["CREDIT", "DEBIT"]).optional(),
    paymentMode: zod_1.z
        .enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"])
        .optional(),
    ...baseFilterSchema,
});
// BILL FILTER SCHEMAS
exports.billFilterSchema = zod_1.z.object({
    billType: zod_1.z
        .enum(["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"])
        .optional(),
    patientSex: zod_1.z.enum(["Male", "Female", "Other"]).optional(),
    status: zod_1.z
        .enum(["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"])
        .optional(),
    ...baseFilterSchema,
});
// MONEY RECEIPT FILTER SCHEMAS
exports.moneyReceiptFilterSchema = zod_1.z.object({
    paymentMode: zod_1.z
        .enum(["Cash", "Cheque", "Card", "Online Transfer", "Other"])
        .optional(),
    status: zod_1.z.enum(["Active", "Cancelled", "Refunded"]).optional(),
    ...baseFilterSchema,
});
