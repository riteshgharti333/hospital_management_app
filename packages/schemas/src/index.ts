import { z } from "zod";

// AUTHENTICATION SCHEMAS
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(64, "Password must not exceed 64 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character",
      ),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const registerSchema = z.object({
  name: z.string().min(3, "Name is too short").max(50).optional(),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64)
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// ADMISSION SCHEMAS
const admissionStatus = z.enum(["ACTIVE", "DISCHARGED", "CANCELLED"]);

export const admissionSchema = z.object({
  patientId: z.number().int().positive("Patient ID is required"),

  status: admissionStatus.default("ACTIVE"),

  doctorId: z.number().int().positive("Doctor ID is required"),

  admissionDate: z.coerce.date(),

  dischargeDate: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.date().optional(),
  ),
});

// BIRTH SCHEMAS
export const birthSchema = z.object({
  birthTime: z.string().min(1, "Birth time is required"),
  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  babySex: z.string().min(1, "Baby's sex is required"),
  babyWeightKg: z.number().positive("Weight must be positive"),
  fathersName: z.string().min(1, "Father's name is required"),
  mothersName: z.string().min(1, "Mother's name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  deliveryType: z.string().min(1, "Delivery type is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  attendantsName: z.string().min(1, "Attendant's name is required"),
});

// DEPARTMENT SCHEMAS
export const DepartmentStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export const DepartmentNameEnum = z.enum([
  "CARDIOLOGY",
  "NEUROLOGY",
  "ORTHOPEDICS",
  "PEDIATRICS",
  "DERMATOLOGY",
  "GENERAL",
]);

export const departmentSchema = z.object({
  name: DepartmentNameEnum,

  description: z.string().optional(),

  headId: z.coerce.number().int().positive("Valid doctor ID is required"),

  status: DepartmentStatusEnum.optional().default("ACTIVE"),
});

// APPOINTMENT SCHEMAS
export const AppointmentStatus = z.enum(["BOOKED", "CANCELLED", "EXPIRED"]);

export const appointmentSchema = z.object({
  appointmentDate: z
    .string()
    .min(1, "Appointment date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),

  appointmentTime: z.string().min(1, "Appointment time is required"),

  doctorId: z
    .number({
      required_error: "Doctor is required",
      invalid_type_error: "Doctor ID must be a number",
    })
    .int("Doctor ID must be an integer")
    .positive("Doctor ID must be positive"),

  status: AppointmentStatus.optional(),
});

// DOCTOR SCHEMAS
export const doctorSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),

  mobileNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  email: z.string().email("Invalid email format"),

  qualification: z.string().min(1, "Qualification is required"),

  designation: z.string().min(1, "Designation is required"),

  specialization: z.string().min(1, "Specialization is required"),

  status: z.string().optional().default("Active"),
});

// NURSE SCHEMAS
export const nurseSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  department: z.string().min(1, "Department is required"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email format"),
  shift: z.string().min(1, "Shift is required"),
  status: z.string().optional().default("Active"),
});

// PATIENT SCHEMAS
export const patientSchema = z.object({
  fullName: z.string().min(1, "Full name is required").trim(),

  dateOfBirth: z.coerce.date({
    required_error: "Date of birth is required",
  }),

  gender: z.string().min(1, "Gender is required"),

  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be 10 digits")
    .optional(),

  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar must be 12 digits")
    .optional(),

  address: z.string().min(1, "Address is required").trim(),
});

// PRESCRIPTION SCHEMAS
export const PrescriptionStatusEnum = z.enum([
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
]);

export const medicineSchema = z.object({
  medicineName: z
    .string({
      required_error: "Medicine name is required",
      invalid_type_error: "Medicine name must be a string",
    })
    .min(1, "Medicine name cannot be empty"),

  dosage: z
    .string({
      required_error: "Dosage is required",
    })
    .min(1, "Dosage cannot be empty"),

  frequency: z
    .string({
      required_error: "Frequency is required",
    })
    .min(1, "Frequency cannot be empty"),

  duration: z
    .string({
      required_error: "Duration is required",
    })
    .min(1, "Duration cannot be empty"),

  instructions: z
    .string({
      invalid_type_error: "Instructions must be a string",
    })
    .optional(),
});

export const prescriptionSchema = z.object({
  admissionId: z.coerce.number({
    required_error: "Admission ID is required",
    invalid_type_error: "Admission ID must be a number",
  }),

  prescriptionDate: z
    .string({
      invalid_type_error: "Date must be a valid string",
    })
    .optional(),

  prescriptionDoc: z
    .string({
      invalid_type_error: "Prescription doc must be a string",
    })
    .url("Invalid URL")
    .optional(),

  notes: z
    .string({
      invalid_type_error: "Notes must be a string",
    })
    .max(1000, "Notes cannot exceed 1000 characters")
    .optional(),

  status: PrescriptionStatusEnum.optional().default("ACTIVE"),

  medicines: z
    .array(medicineSchema, {
      required_error: "At least one medicine is required",
    })
    .min(1, "At least one medicine is required"),
});

export const prescriptionFilterSchema = z.object({
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  status: PrescriptionStatusEnum.optional(),
  admissionId: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().optional(),
});

// TRANSACTION SCHEMAS
export const billItemSchema = z.object({
  company: z.string().min(1, "Company is required"),
  itemOrService: z.string().min(1, "Item/Service is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  mrp: z.number().min(0, "MRP must be a non-negative number"),
  totalAmount: z.number().min(0).optional(),
});

export const billSchema = z.object({
  billDate: z.coerce.date(),
  billType: z.string().min(1, "Bill type is required"),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  patientName: z.string().min(1, "Patient name is required"),
  admissionNo: z.string().min(1, "Admission number is required"),
  admissionDate: z
    .string()
    .min(1, "Admission date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  patientSex: z.enum(["Male", "Female", "Other"]),
  dischargeDate: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.date().optional(),
  ),
  address: z.string().min(1, "Address is required"),
  status: z
    .enum(["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"])
    .default("Pending"),
  billItems: z
    .array(billItemSchema)
    .min(1, "At least one bill item is required"),
});

export const moneyReceiptSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  patientName: z.string().min(1, "Patient name is required"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  admissionNo: z.string().min(1, "Admission number is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  paymentMode: z.enum(["Cash", "Cheque", "Card", "Online Transfer", "Other"]),
  remarks: z.string().optional(),
  receivedBy: z.string().min(1, "Received by is required"),
  status: z
    .enum(["Active", "Cancelled", "Refunded"])
    .optional()
    .default("Active"),
});

// CASH & BANK SCHEMAS
export const cashSchema = z.object({
  cashName: z.string().min(2, "Cash name is required").max(100),
  isActive: z.boolean().optional(),
});

export const bankSchema = z.object({
  bankName: z.string().min(2, "Bank name is required").max(100),
  accountNo: z.string().min(6, "Account number is required").max(50),
  ifscCode: z.string().min(4, "Invalid IFSC").max(20).optional(),
  isActive: z.boolean().optional(),
});

// LEDGER SCHEMAS
const CashAmountTypeEnum = z.enum(["INCOME", "EXPENSE"]);

export const AmountTypeEnum = z.enum(["CREDIT", "DEBIT"]);
export const PaymentModeEnum = z.enum([
  "CASH",
  "CARD",
  "UPI",
  "BANK_TRANSFER",
  "CHEQUE",
]);
export const ENTITY_TYPES = ["PATIENT", "DOCTOR", "BANK", "CASH"] as const;
export const REFERENCE_TYPES = [
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
] as const;

const requiredDate = z.preprocess(
  (val) => {
    if (val === undefined || val === null || val === "") {
      return undefined;
    }
    return new Date(val as string);
  },
  z.date({
    required_error: "Date is required",
    invalid_type_error: "Date is required",
  }),
);

export const ledgerSchema = z.object({
  entityType: z
    .string({
      required_error: "Entity type is required",
      invalid_type_error: "Entity type must be a valid string",
    })
    .refine((val) => ENTITY_TYPES.includes(val as any), {
      message:
        "Invalid entity type. Allowed values are: " + ENTITY_TYPES.join(", "),
    }),

  entityId: z.string({
    required_error: "Entity ID is required",
  }),

  transactionDate: requiredDate,

  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(1, "Description cannot be empty")
    .max(255, "Description cannot exceed 255 characters"),

  amountType: AmountTypeEnum.refine((val) => val !== undefined, {
    message: "Amount type is required (e.g., CREDIT or DEBIT)",
  }),

  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a valid number",
    })
    .positive("Amount must be greater than 0"),

  paymentMode: PaymentModeEnum.optional(),

  referenceType: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional()
    .refine((val) => !val || REFERENCE_TYPES.includes(val as any), {
      message: "Invalid reference type",
    }),

  referenceId: z
    .string({
      invalid_type_error: "Reference ID must be a string",
    })
    .optional(),

  remarks: z
    .string({
      invalid_type_error: "Remarks must be a string",
    })
    .max(500, "Remarks cannot exceed 500 characters")
    .optional(),
});

// BASE FILTER SCHEMA
const baseFilterSchema = {
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
};

// LEDGER FILTER SCHEMAS
export const ledgerFilterSchema = z.object({
  entityType: z.enum(["PATIENT", "DOCTOR", "BANK", "CASH"]).optional(),
  amountType: z.enum(["CREDIT", "DEBIT"]).optional(),
  paymentMode: z
    .enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"])
    .optional(),
  ...baseFilterSchema,
});

// CASH FILTER SCHEMAS
export const cashFilterSchema = z.object({
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
  ...baseFilterSchema,
});

// BANK FILTER SCHEMAS
export const bankFilterSchema = z.object({
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
  ...baseFilterSchema,
});

// ADMISSION FILTER SCHEMAS
export const admissionFilterSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  ...baseFilterSchema,
});

// BIRTH FILTER SCHEMAS
export const birthFilterSchema = z.object({
  babySex: z.enum(["Male", "Female", "Other"]).optional(),
  deliveryType: z.enum(["Normal", "Cesarean", "Forceps", "Vacuum"]).optional(),
  ...baseFilterSchema,
});

// PATIENT FILTER SCHEMAS
export const patientFilterSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  ...baseFilterSchema,
});

// DEPARTMENT FILTER SCHEMAS
export const departmentFilterSchema = z.object({
  status: DepartmentStatusEnum.optional(),
  ...baseFilterSchema,
});

// APPOINTMENT FILTER SCHEMAS
export const appointmentFilterSchema = z.object({
  department: z.string().optional(),
  ...baseFilterSchema,
});

// NURSE FILTER SCHEMAS
export const nurseFilterSchema = z.object({
  shift: z.enum(["Day", "Night", "Rotating"]).optional(),
  status: z.enum(["Active", "Inactive", "On Leave"]).optional(),
  ...baseFilterSchema,
});

// DOCTOR FILTER SCHEMAS
export const doctorFilterSchema = z.object({
  status: z.enum(["Active", "Inactive", "On Leave"]).optional(),
  ...baseFilterSchema,
});

// PATIENT LEDGER FILTER SCHEMAS
export const patientLedgerFilterSchema = z.object({
  amountType: z.enum(["CREDIT", "DEBIT"]).optional(),
  paymentMode: z
    .enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"])
    .optional(),
  ...baseFilterSchema,
});

// DOCTOR LEDGER FILTER SCHEMAS
export const doctorLedgerFilterSchema = z.object({
  amountType: z.enum(["CREDIT", "DEBIT"]).optional(),
  paymentMode: z
    .enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"])
    .optional(),
  ...baseFilterSchema,
});

// BILL FILTER SCHEMAS
export const billFilterSchema = z.object({
  billType: z
    .enum(["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"])
    .optional(),
  patientSex: z.enum(["Male", "Female", "Other"]).optional(),
  status: z
    .enum(["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"])
    .optional(),
  ...baseFilterSchema,
});

// MONEY RECEIPT FILTER SCHEMAS
export const moneyReceiptFilterSchema = z.object({
  paymentMode: z
    .enum(["Cash", "Cheque", "Card", "Online Transfer", "Other"])
    .optional(),
  status: z.enum(["Active", "Cancelled", "Refunded"]).optional(),
  ...baseFilterSchema,
});
