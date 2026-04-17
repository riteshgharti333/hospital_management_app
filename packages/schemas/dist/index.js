"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moneyReceiptFilterSchema =
  exports.billFilterSchema =
  exports.doctorLedgerFilterSchema =
  exports.cashLedgerFilterSchema =
  exports.bankLedgerFilterSchema =
  exports.patientLedgerFilterSchema =
  exports.prescriptionFilterSchema =
  exports.doctorFilterSchema =
  exports.nurseFilterSchema =
  exports.appointmentFilterSchema =
  exports.departmentFilterSchema =
  exports.patientFilterSchema =
  exports.birthFilterSchema =
  exports.admissionFilterSchema =
  exports.supplierLedgerSchema =
  exports.pharmacyLedgerSchema =
  exports.insuranceLedgerSchema =
  exports.expenseLedgerSchema =
  exports.diagnosticsLedgerSchema =
  exports.patientLedgerSchema =
  exports.doctorLedgerSchema =
  exports.cashLedgerSchema =
  exports.bankLedgerSchema =
  exports.serviceChargeSchema =
  exports.productMaterialSchema =
  exports.materialSpecSchema =
  exports.productSchema =
  exports.brandSchema =
  exports.voucherSchema =
  exports.moneyReceiptSchema =
  exports.employeeSchema =
  exports.billSchema =
  exports.billItemSchema =
  exports.xrayReportSchema =
  exports.prescriptionSchema =
  exports.medicineSchema =
  exports.pharmacistSchema =
  exports.patientSchema =
  exports.nurseSchema =
  exports.doctorSchema =
  exports.departmentSchema =
  exports.birthSchema =
  exports.bedAssignmentSchema =
  exports.appointmentSchema =
  exports.ambulanceSchema =
  exports.admissionSchema =
  exports.bedSchema =
  exports.loginSchema =
  exports.registerSchema =
  exports.changePasswordSchema =
    void 0;
exports.FilterSchemas = void 0;
const zod_1 = require("zod");
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
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character",
      ),
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
//////////////////
exports.bedSchema = zod_1.z.object({
  bedNumber: zod_1.z.string().min(1, "Bed number is required"),
  wardNumber: zod_1.z.string().min(1, "Ward number is required"),
  status: zod_1.z
    .enum(["Available", "Occupied", "Maintenance"])
    .default("Available"),
  description: zod_1.z.string().optional(),
});
////////////////
exports.admissionSchema = zod_1.z.object({
  patientId: zod_1.z.number().int().positive("Patient ID is required"),
  doctorId: zod_1.z.number().int().positive("Doctor ID is required"),
  admissionDate: zod_1.z.coerce.date(),
  dischargeDate: zod_1.z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    zod_1.z.coerce.date().optional(),
  ),
  status: zod_1.z.string().default("ADMITTED"),
});
///////////////
exports.ambulanceSchema = zod_1.z.object({
  modelName: zod_1.z.string().min(1, "Model name is required"),
  brand: zod_1.z.string().min(1, "Brand is required"),
  registrationNo: zod_1.z.string().min(1, "Registration number is required"),
  driverName: zod_1.z.string().min(1, "Driver name is required"),
  driverContact: zod_1.z
    .string()
    .min(10, "Driver contact must be at least 10 digits"),
  status: zod_1.z
    .enum(["Available", "On-Call", "Maintenance"])
    .default("Available"),
});
////////////
exports.appointmentSchema = zod_1.z.object({
  appointmentDate: zod_1.z
    .string()
    .min(1, "Appointment date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  doctorName: zod_1.z.string().min(1, "Doctor name is required"),
  department: zod_1.z.string().min(1, "Department is required"),
  appointmentTime: zod_1.z.string().min(1, "Appointment time is required"),
});
////////
exports.bedAssignmentSchema = zod_1.z.object({
  wardNumber: zod_1.z.string().min(1, "Ward number is required"),
  bedNumber: zod_1.z.string().min(1, "Bed number is required"),
  bedType: zod_1.z.string().min(1, "Bed type is required"),
  patientName: zod_1.z.string().min(1, "Patient name is required"),
  allocateDate: zod_1.z
    .string()
    .min(1, "Allocation date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  dischargeDate: zod_1.z.preprocess(
    (val) => (val === "" ? undefined : val),
    zod_1.z.coerce.date().optional(),
  ),
  status: zod_1.z
    .enum(["Active", "Discharged", "Transferred"])
    .default("Active"),
  notes: zod_1.z.string().optional(),
});
/////////////
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
  mobileNumber: zod_1.z
    .string()
    .min(10, "Mobile number must be at least 10 digits"),
  deliveryType: zod_1.z.string().min(1, "Delivery type is required"),
  placeOfBirth: zod_1.z.string().min(1, "Place of birth is required"),
  attendantsName: zod_1.z.string().min(1, "Attendant's name is required"),
});
///////////
exports.departmentSchema = zod_1.z.object({
  name: zod_1.z.string().min(1, "Department name is required"),
  head: zod_1.z.string().min(1, "Department head is required"),
  contactNumber: zod_1.z.string().min(10, "Contact number must be 10 digits"),
  email: zod_1.z.string().email("Invalid email address"),
  location: zod_1.z.string().min(1, "Location is required"),
  description: zod_1.z.string().min(1, "Description is required"),
  status: zod_1.z.string().optional().default("Active"),
});
/////////////
exports.doctorSchema = zod_1.z.object({
  fullName: zod_1.z.string().min(1, "Full name is required"),
  mobileNumber: zod_1.z
    .string()
    .min(10, "Mobile number must be at least 10 digits"),
  email: zod_1.z.string().email("Invalid email format"),
  qualification: zod_1.z.string().min(1, "Qualification is required"),
  designation: zod_1.z.string().min(1, "Designation is required"),
  department: zod_1.z.string().min(1, "Department is required"),
  specialization: zod_1.z.string().min(1, "Specialization is required"),
  status: zod_1.z.string().optional().default("Active"),
});
///////////
exports.nurseSchema = zod_1.z.object({
  fullName: zod_1.z.string().min(1, "Full name is required"),
  mobileNumber: zod_1.z
    .string()
    .min(10, "Mobile number must be at least 10 digits"),
  department: zod_1.z.string().min(1, "Department is required"),
  address: zod_1.z.string().min(1, "Address is required"),
  email: zod_1.z.string().email("Invalid email format"),
  shift: zod_1.z.string().min(1, "Shift is required"),
  status: zod_1.z.string().optional().default("Active"),
});
/////////////////
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
//////////////
exports.pharmacistSchema = zod_1.z.object({
  fullName: zod_1.z.string().min(1, "Full name is required"),
  mobileNumber: zod_1.z
    .string()
    .min(10, "Mobile number must be at least 10 digits"),
  registrationNo: zod_1.z.string().min(1, "Registration number is required"),
  address: zod_1.z.string().min(1, "Address is required"),
  department: zod_1.z.string().min(1, "Department is required"),
  status: zod_1.z.string().optional().default("Active"),
});
/////////////////////
exports.medicineSchema = zod_1.z.object({
  medicineName: zod_1.z.string().min(1, "Medicine name is required"),
  description: zod_1.z.string().min(1, "Description is required"),
});
exports.prescriptionSchema = zod_1.z.object({
  admissionId: zod_1.z.number().int().positive("Admission ID is required"),
  doctorId: zod_1.z.number().int().positive("Doctor ID is required"),
  prescriptionDate: zod_1.z.coerce.date(),
  prescriptionDoc: zod_1.z.string().url().optional(),
  medicines: zod_1.z
    .array(exports.medicineSchema)
    .min(1, "At least one medicine is required"),
});
////////////////
exports.xrayReportSchema = zod_1.z.object({
  billDate: zod_1.z.coerce.date(),
  patientMobile: zod_1.z.string().min(10, "Valid mobile number required"),
  patientName: zod_1.z.string().min(1, "Patient name is required"),
  patientSex: zod_1.z.enum(["Male", "Female", "Other"]),
  age: zod_1.z.number().positive("Age must be positive"),
  referredDoctor: zod_1.z.string().min(1, "Referred doctor is required"),
  testDate: zod_1.z.coerce.date(),
  reportDate: zod_1.z
    .string()
    .min(1, "Report date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  patientAddress: zod_1.z.string().optional(),
  examDescription: zod_1.z.string().min(1, "Exam description is required"),
  department: zod_1.z.string().min(1, "Department is required"),
  billAmount: zod_1.z.number().positive("Bill amount must be positive"),
  discountPercent: zod_1.z
    .number()
    .min(0)
    .max(100, "Discount must be between 0-100%"),
  netBillAmount: zod_1.z.number().positive("Net amount must be positive"),
  commissionPercent: zod_1.z
    .number()
    .min(0)
    .max(100, "Commission must be between 0-100%"),
  doctorEarning: zod_1.z.number().min(0, "Doctor earning must be positive"),
});
////////////// Transection Schema
exports.billItemSchema = zod_1.z.object({
  company: zod_1.z.string().min(1, "Company is required"),
  itemOrService: zod_1.z.string().min(1, "Item/Service is required"),
  quantity: zod_1.z.number().min(1, "Quantity must be at least 1"),
  mrp: zod_1.z.number().min(0, "MRP must be a non-negative number"),
  totalAmount: zod_1.z.number().min(0).optional(),
});
exports.billSchema = zod_1.z.object({
  billDate: zod_1.z.coerce.date(),
  billType: zod_1.z.string().min(1, "Bill type is required"),
  totalAmount: zod_1.z.number().min(0, "Total amount must be positive"),
  mobile: zod_1.z.string().min(10, "Mobile must be at least 10 digits"),
  patientName: zod_1.z.string().min(1, "Patient name is required"),
  admissionNo: zod_1.z.string().min(1, "Admission number is required"),
  admissionDate: zod_1.z
    .string()
    .min(1, "Admission date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  patientAge: zod_1.z.coerce.number().int().positive("Age must be positive"),
  patientSex: zod_1.z.enum(["Male", "Female", "Other"]),
  dischargeDate: zod_1.z.preprocess(
    (val) => (val === "" ? undefined : val),
    zod_1.z.coerce.date().optional(),
  ),
  address: zod_1.z.string().min(1, "Address is required"),
  status: zod_1.z
    .enum(["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"])
    .default("Pending"),
  billItems: zod_1.z
    .array(exports.billItemSchema)
    .min(1, "At least one bill item is required"),
});
exports.employeeSchema = zod_1.z.object({
  employeeName: zod_1.z.string().min(1, "Employee name is required"),
  fathersName: zod_1.z.string().min(1, "Father's name is required"),
  dateOfRegistration: zod_1.z.string().transform((val) => new Date(val)),
  contactNo: zod_1.z
    .string()
    .min(10, "Contact number must be at least 10 digits"),
  dateOfBirth: zod_1.z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  email: zod_1.z.string().email().optional(),
  gender: zod_1.z.enum(["Male", "Female", "Other"]),
  maritalStatus: zod_1.z.enum(["Married", "Unmarried"]),
  aadharNo: zod_1.z.string().length(12, "Aadhar must be 12 digits").optional(),
  voterId: zod_1.z.string().min(1, "Voter ID is required").optional(),
  bloodGroup: zod_1.z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  department: zod_1.z.string().min(1, "Department is required"),
  photoUrl: zod_1.z.string().optional(),
});
exports.moneyReceiptSchema = zod_1.z.object({
  date: zod_1.z.string().transform((val) => new Date(val)),
  patientName: zod_1.z.string().min(1, "Patient name is required"),
  mobile: zod_1.z.string().min(10, "Mobile must be at least 10 digits"),
  admissionNo: zod_1.z.string().min(1, "Admission number is required"),
  amount: zod_1.z.coerce.number().min(0.01, "Amount must be greater than 0"),
  paymentMode: zod_1.z.enum([
    "Cash",
    "Cheque",
    "Card",
    "Online Transfer",
    "Other",
  ]),
  remarks: zod_1.z.string().optional(),
  receivedBy: zod_1.z.string().min(1, "Received by is required"),
  status: zod_1.z
    .enum(["Active", "Cancelled", "Refunded"])
    .optional()
    .default("Active"),
});
exports.voucherSchema = zod_1.z.object({
  voucherDate: zod_1.z.string().transform((val) => new Date(val)),
  paymentFor: zod_1.z.string().min(1, "Payment for is required"),
  voucherType: zod_1.z.enum(["Payment", "Receipt", "Journal"]),
  vendorName: zod_1.z.string().min(1, "Vendor name is required"),
  paymentDate: zod_1.z
    .string()
    .min(1, "Payment date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  amount: zod_1.z.number().min(0.01, "Amount must be positive"),
  paymentMode: zod_1.z.enum([
    "Cash",
    "Cheque",
    "Bank Transfer",
    "Card",
    "Online",
  ]),
  referenceNo: zod_1.z.string().optional(),
  description: zod_1.z.string().optional(),
  status: zod_1.z
    .enum(["Pending", "Approved", "Rejected", "Paid"])
    .optional()
    .default("Pending"),
});
////////////// item
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
exports.brandSchema = zod_1.z.object({
  brandName: zod_1.z.string().min(1, "Brand name is required"),
  // brandLogo: z.string().url().optional(),
  description: zod_1.z.string().min(1, "Description is required"),
  status: zod_1.z.enum(["Active", "Inactive"]).default("Active"),
});
exports.productSchema = zod_1.z.object({
  productName: zod_1.z.string().min(1, "Product name is required"),
  productCode: zod_1.z.string().min(1, "Product code is required"),
  parentCategory: zod_1.z.string().min(1, "Parent category is required"),
  subCategory: zod_1.z.string().min(1, "Sub category is required"),
  categoryLogo: zod_1.z.string().url().optional(),
  description: zod_1.z.string().optional(),
  unit: zod_1.z.string().min(1, "Unit is required"),
  price: zod_1.z.number().min(0, "Price must be positive"),
  taxRate: zod_1.z.number().min(0, "Tax rate must be positive"),
  status: zod_1.z.string().optional().default("Active"),
});
exports.materialSpecSchema = zod_1.z.object({
  uom: zod_1.z.string().min(1, "UOM is required"),
  description: zod_1.z.string().optional(),
  alterUnit: zod_1.z.string().optional(),
  alterUnitValue: zod_1.z.number().optional(),
  serialUniqueNo: zod_1.z.string().optional(),
});
exports.productMaterialSchema = zod_1.z.object({
  brand: zod_1.z.string().min(1, "Brand is required"),
  category: zod_1.z.string().min(1, "Category is required"),
  productName: zod_1.z.string().min(1, "Product name is required"),
  shortDescription: zod_1.z.string().optional(),
  hsnCode: zod_1.z.string().min(1, "HSN Code is required"),
  gstPercentage: zod_1.z.string().min(1, "GST Percentage is required"),
  status: zod_1.z.string().default("Active"),
  specifications: zod_1.z.array(exports.materialSpecSchema).optional(),
});
exports.serviceChargeSchema = zod_1.z.object({
  serviceName: zod_1.z.string().min(1, "Service name is required"),
  category: zod_1.z.string().min(1, "Category is required"),
  chargeType: zod_1.z.string().min(1, "Charge type is required"),
  baseAmount: zod_1.z.number().min(0, "Base amount must be positive"),
  taxApplicable: zod_1.z.boolean().default(false),
  taxPercentage: zod_1.z.number().min(0).max(100).optional(),
  status: zod_1.z.string().optional().default("Active"),
  notes: zod_1.z.string().optional(),
});
////////////// ledger
const AmountTypeEnum = zod_1.z.enum(["CREDIT", "DEBIT"]);
const CashAmountTypeEnum = zod_1.z.enum(["INCOME", "EXPENSE"]);
const PaymentModeEnum = zod_1.z.enum([
  "CASH",
  "CARD",
  "UPI",
  "BANK_TRANSFER",
  "CHEQUE",
]);
const requiredDate = zod_1.z.preprocess(
  (val) => {
    if (val === undefined || val === null || val === "") {
      return undefined;
    }
    return new Date(val);
  },
  zod_1.z.date({
    required_error: "Date is required",
    invalid_type_error: "Date is required",
  }),
);
exports.bankLedgerSchema = zod_1.z.object({
  bankName: zod_1.z.string().min(1, "Bank name is required"),
  transactionDate: requiredDate,
  description: zod_1.z.string().min(1, "Description is required"),
  amountType: AmountTypeEnum,
  amount: zod_1.z.number().positive("Amount must be positive"),
  transactionId: zod_1.z.string().optional(),
  remarks: zod_1.z.string().optional(),
});
exports.cashLedgerSchema = zod_1.z.object({
  transactionDate: requiredDate,
  purpose: zod_1.z.string().min(1, "Purpose is required"),
  amountType: CashAmountTypeEnum,
  amount: zod_1.z.number().positive("Amount must be positive"),
  remarks: zod_1.z.string().optional(),
});
exports.doctorLedgerSchema = zod_1.z.object({
  doctorName: zod_1.z.string().min(1, "Doctor name is required"),
  transactionDate: requiredDate,
  description: zod_1.z.string().min(1, "Description is required"),
  amountType: AmountTypeEnum,
  amount: zod_1.z.number().positive("Amount must be positive"),
  paymentMode: PaymentModeEnum,
  transactionId: zod_1.z.string().optional(),
  remarks: zod_1.z.string().optional(),
});
exports.patientLedgerSchema = zod_1.z.object({
  patientName: zod_1.z.string().min(1, "Patient name is required"),
  transactionDate: requiredDate,
  description: zod_1.z.string().min(1, "Description is required"),
  amountType: AmountTypeEnum,
  amount: zod_1.z.number().positive("Amount must be positive"),
  paymentMode: PaymentModeEnum,
  transactionId: zod_1.z.string().optional(),
  remarks: zod_1.z.string().optional(),
});
exports.diagnosticsLedgerSchema = zod_1.z.object({
  patientName: zod_1.z.string().min(1, "Patient name is required"),
  date: zod_1.z.coerce.date(),
  testName: zod_1.z.string().min(1, "Test name is required"),
  description: zod_1.z.string().min(1, "Description is required"),
  amount: zod_1.z.number().positive("Amount must be positive"),
  paymentMode: zod_1.z.string().min(1, "Payment mode is required"),
  attachReport: zod_1.z.string().url().nullable().optional(),
  remarks: zod_1.z.string().optional(),
});
exports.expenseLedgerSchema = zod_1.z.object({
  expenseCategory: zod_1.z.string().min(1, "Expense category is required"),
  date: zod_1.z.coerce.date(),
  description: zod_1.z.string().min(1, "Description is required"),
  amount: zod_1.z.number().positive("Amount must be positive"),
  paymentMode: zod_1.z.string().min(1, "Payment mode is required"),
  transactionId: zod_1.z.string().optional(),
  remarks: zod_1.z.string().optional(),
});
exports.insuranceLedgerSchema = zod_1.z.object({
  patientName: zod_1.z.string().min(1),
  tpaInsuranceCompany: zod_1.z.string().min(1),
  claimAmount: zod_1.z.number().positive(),
  approvedAmount: zod_1.z.number().min(0).optional(),
  settledAmount: zod_1.z.number().min(0).optional(),
  status: zod_1.z.enum([
    "Pending",
    "Approved",
    "Rejected",
    "Partially Approved",
    "Settled",
  ]),
  remarks: zod_1.z.string().optional(),
  claimDate: zod_1.z.coerce.date(),
  approvalDate: zod_1.z
    .union([zod_1.z.coerce.date(), zod_1.z.literal(""), zod_1.z.undefined()])
    .transform((val) => (val === "" ? undefined : val)),
  settlementDate: zod_1.z
    .union([zod_1.z.coerce.date(), zod_1.z.literal(""), zod_1.z.undefined()])
    .transform((val) => (val === "" ? undefined : val)),
});
exports.pharmacyLedgerSchema = zod_1.z.object({
  date: zod_1.z.coerce.date(),
  medicineName: zod_1.z.string().min(1, "Medicine name is required"),
  category: zod_1.z.string().min(1, "Category is required"),
  description: zod_1.z.string().min(1, "Description is required"),
  amountType: zod_1.z.enum(["Income", "Expense"]),
  amount: zod_1.z.number().positive("Amount must be positive"),
  paymentMode: zod_1.z.string().min(1, "Payment mode is required"),
  remarks: zod_1.z.string().optional(),
});
exports.supplierLedgerSchema = zod_1.z.object({
  supplierName: zod_1.z.string().min(1, "Supplier name is required"),
  date: zod_1.z.coerce.date(),
  invoiceNo: zod_1.z.string().min(1, "Invoice number is required"),
  description: zod_1.z.string().min(1, "Description is required"),
  amountType: zod_1.z.enum(["Credit", "Debit"]),
  amount: zod_1.z.number().positive("Amount must be positive"),
  paymentMode: zod_1.z.string().optional(),
  transactionId: zod_1.z.string().optional(),
  attachBill: zod_1.z.string().url().nullable().optional(),
  remarks: zod_1.z.string().optional(),
});
////////// filter
// ============================================
// 🔹 BASE FILTER SCHEMA (shared foundation)
// ============================================
const baseFilterSchema = {
  fromDate: zod_1.z.coerce.date().optional(),
  toDate: zod_1.z.coerce.date().optional(),
  limit: zod_1.z.coerce.number().min(1).max(100).default(50),
  cursor: zod_1.z.string().optional(), // ✅ composite cursor for keyset pagination
};
// ============================================
// 🔹 ADMISSION FILTER
// ============================================
exports.admissionFilterSchema = zod_1.z.object({
  gender: zod_1.z.enum(["Male", "Female", "Other"]).optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 BIRTH FILTER
// ============================================
exports.birthFilterSchema = zod_1.z.object({
  babySex: zod_1.z.enum(["Male", "Female", "Other"]).optional(),
  deliveryType: zod_1.z
    .enum(["Normal", "Cesarean", "Forceps", "Vacuum"])
    .optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 PATIENT FILTER
// ============================================
exports.patientFilterSchema = zod_1.z.object({
  gender: zod_1.z.enum(["Male", "Female", "Other"]).optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 DEPARTMENT FILTER
// ============================================
exports.departmentFilterSchema = zod_1.z.object({
  status: zod_1.z.enum(["Active", "Inactive"]).optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 APPOINTMENT FILTER
// ============================================
exports.appointmentFilterSchema = zod_1.z.object({
  department: zod_1.z.string().optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 NURSE FILTER
// ============================================
exports.nurseFilterSchema = zod_1.z.object({
  shift: zod_1.z.enum(["Day", "Night", "Rotating"]).optional(),
  status: zod_1.z.enum(["Active", "Inactive", "On Leave"]).optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 DOCTOR FILTER
// ============================================
exports.doctorFilterSchema = zod_1.z.object({
  status: zod_1.z.enum(["Active", "Inactive", "On Leave"]).optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 PRESCRIPTION FILTER
// ============================================
exports.prescriptionFilterSchema = zod_1.z.object({
  ...baseFilterSchema,
});
// ============================================
// 🔹 PATIENT LEDGER FILTER
// ============================================
exports.patientLedgerFilterSchema = zod_1.z.object({
  amountType: zod_1.z.enum(["CREDIT", "DEBIT"]).optional(),
  paymentMode: zod_1.z
    .enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"])
    .optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 BANK LEDGER FILTER
// ============================================
exports.bankLedgerFilterSchema = zod_1.z.object({
  amountType: zod_1.z.enum(["CREDIT", "DEBIT"]).optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 CASH LEDGER FILTER
// ============================================
exports.cashLedgerFilterSchema = zod_1.z.object({
  amountType: zod_1.z.enum(["INCOME", "EXPENSE"]).optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 DOCTOR LEDGER FILTER
// ============================================
exports.doctorLedgerFilterSchema = zod_1.z.object({
  amountType: zod_1.z.enum(["CREDIT", "DEBIT"]).optional(),
  paymentMode: zod_1.z
    .enum(["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"])
    .optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 BILL FILTER
// ============================================
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
// ============================================
// 🔹 MONEY RECEIPT FILTER
// ============================================
exports.moneyReceiptFilterSchema = zod_1.z.object({
  paymentMode: zod_1.z
    .enum(["Cash", "Cheque", "Card", "Online Transfer", "Other"])
    .optional(),
  status: zod_1.z.enum(["Active", "Cancelled", "Refunded"]).optional(),
  ...baseFilterSchema,
});
// ============================================
// 🔹 EXPORT ALL AS NAMESPACE (optional convenience)
// ============================================
exports.FilterSchemas = {
  admission: exports.admissionFilterSchema,
  birth: exports.birthFilterSchema,
  patient: exports.patientFilterSchema,
  department: exports.departmentFilterSchema,
  appointment: exports.appointmentFilterSchema,
  nurse: exports.nurseFilterSchema,
  doctor: exports.doctorFilterSchema,
  prescription: exports.prescriptionFilterSchema,
  patientLedger: exports.patientLedgerFilterSchema,
  bankLedger: exports.bankLedgerFilterSchema,
  cashLedger: exports.cashLedgerFilterSchema,
  doctorLedger: exports.doctorLedgerFilterSchema,
  bill: exports.billFilterSchema,
  moneyReceipt: exports.moneyReceiptFilterSchema,
};
