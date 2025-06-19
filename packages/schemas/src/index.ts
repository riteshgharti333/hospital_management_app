import { z } from "zod";

export const authSchema = z.object({
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

//////////////////

export const bedSchema = z.object({
  bedNumber: z.string().min(1, "Bed number is required"),
  wardNumber: z.string().min(1, "Ward number is required"),
  status: z.enum(["Available", "Occupied", "Maintenance"]).default("Available"),
  description: z.string().optional(),
});

////////////////

export const admissionSchema = z.object({
  admissionDate: z.coerce.date(),
  admissionTime: z.string().min(1, "Admission time is required"),
  dischargeDate: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce.date().optional()
  ),

  gsRsRegNo: z.string().min(1, "GS/RS Reg No is required"),
  wardNo: z.string().min(1, "Ward No is required"),
  bedNo: z.string().min(1, "Bed No is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  aadhaarNo: z.string().min(12, "Aadhaar No must be 12 digits").max(12),
  urnNo: z.string().optional(),
  patientName: z.string().min(1, "Patient name is required"),
  patientAge: z.number().int().positive("Age must be positive"),
  patientSex: z.string().min(1, "Patient sex is required"),
  guardianType: z.string().min(1, "Guardian type is required"),
  guardianName: z.string().min(1, "Guardian name is required"),
  phoneNo: z.string().min(10, "Phone number must be at least 10 digits"),
  patientAddress: z.string().min(1, "Address is required"),
  bodyWeightKg: z.number(),
  bodyHeightCm: z.number(),
  literacy: z.string().min(1, "Literacy status is required"),
  occupation: z.string().min(1, "Occupation is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  isDelivery: z.boolean().default(false),
});

///////////////

export const ambulanceSchema = z.object({
  modelName: z.string().min(1, "Model name is required"),
  brand: z.string().min(1, "Brand is required"),
  registrationNo: z.string().min(1, "Registration number is required"),
  driverName: z.string().min(1, "Driver name is required"),
  driverContact: z
    .string()
    .min(10, "Driver contact must be at least 10 digits"),
  status: z.enum(["Available", "On-Call", "Maintenance"]).default("Available"),
});

////////////

export const appointmentSchema = z.object({
  appointmentDate: z.coerce.date(),
  doctorName: z.string().min(1, "Doctor name is required"),
  department: z.string().min(1, "Department is required"),
  appointmentTime: z.string().min(1, "Appointment time is required"),
});

////////

export const bedAssignmentSchema = z.object({
  wardNumber: z.string().min(1, "Ward number is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  bedType: z.string().min(1, "Bed type is required"),
  patientName: z.string().min(1, "Patient name is required"),
  allocateDate: z.coerce.date(),
  dischargeDate: z.coerce.date().optional(),
  status: z.enum(["Active", "Discharged", "Transferred"]).default("Active"),
  notes: z.string().optional(),
});

/////////////

export const birthSchema = z.object({
  birthTime: z.string().min(1, "Birth time is required"),
  birthDate: z.coerce.date(),
  babySex: z.string().min(1, "Baby's sex is required"),
  babyWeightKg: z.number().positive("Weight must be positive"),
  fathersName: z.string().min(1, "Father's name is required"),
  mothersName: z.string().min(1, "Mother's name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  deliveryType: z.string().min(1, "Delivery type is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  attendantsName: z.string().min(1, "Attendant's name is required"),
});

///////////

export const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  head: z.string().min(1, "Department head is required"),
  contactNumber: z.string().min(10, "Contact number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().optional().default("Active"),
});

/////////////

export const doctorSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  registrationNo: z.string().min(1, "Registration number is required"),
  qualification: z.string().min(1, "Qualification is required"),
  designation: z.string().min(1, "Designation is required"),
  department: z.string().min(1, "Department is required"),
  specialization: z.string().min(1, "Specialization is required"),
  status: z.string().optional().default("Active"),
});

///////////

export const nurseSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  registrationNo: z.string().min(1, "Registration number is required"),
  department: z.string().min(1, "Department is required"),
  address: z.string().min(1, "Address is required"),
  shift: z.string().min(1, "Shift is required"),
  status: z.string().optional().default("Active"),
});

/////////////////

export const patientSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  age: z.number().int().positive("Age must be positive"),
  mobileNumber: z.string().min(10, "Mobile number must be 10 digits"),
  gender: z.string().min(1, "Gender is required"),
  bedNumber: z.string().min(1, "Bed number is required"),
  aadhaarNumber: z.string().length(12, "Aadhaar must be 12 digits"),
  address: z.string().min(1, "Address is required"),
  medicalHistory: z.string().min(1, "Medical history is required"),
});

//////////////

export const pharmacistSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  registrationNo: z.string().min(1, "Registration number is required"),
  address: z.string().min(1, "Address is required"),
  department: z.string().min(1, "Department is required"),
  status: z.string().optional().default("Active"),
});

/////////////////////

export const medicineSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  description: z.string().min(1, "Description is required"),
});

export const prescriptionSchema = z.object({
  prescriptionDate: z.coerce.date(),
  doctorId: z.number().min(1, "Doctor ID is required"),
  patientId: z.number().min(1, "Patient ID is required"),
   prescriptionDoc: z.string().url().optional(),
  status: z.string().optional().default("Active"),
  medicines: z
    .array(medicineSchema)
    .min(1, "At least one medicine is required"),
});

////////////////

export const xrayReportSchema = z.object({
  billDate: z.coerce.date(),
  patientMobile: z.string().min(10, "Valid mobile number required"),
  patientName: z.string().min(1, "Patient name is required"),
  patientSex: z.enum(["Male", "Female", "Other"]),
  age: z.number().int().min(0, "Age must be positive"),
  referredDoctor: z.string().min(1, "Referred doctor is required"),
  testDate: z.coerce.date(),
  reportDate: z.coerce.date(),
  patientAddress: z.string().optional(),
  examDescription: z.string().min(1, "Exam description is required"),
  department: z.string().min(1, "Department is required"),
  billAmount: z.number().positive("Bill amount must be positive"),
  discountPercent: z
    .number()
    .min(0)
    .max(100, "Discount must be between 0-100%"),
  netBillAmount: z.number().positive("Net amount must be positive"),
  commissionPercent: z
    .number()
    .min(0)
    .max(100, "Commission must be between 0-100%"),
  doctorEarning: z.number().min(0, "Doctor earning must be positive"),
});

////////////// Transection Schema

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
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  admissionNo: z.string().min(1, "Admission number is required"),
  admissionDate: z.coerce.date(),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["Male", "Female", "Other"]),
  dischargeDate: z.coerce.date().optional().nullable(),
  address: z.string().min(1, "Address is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  wardNo: z.string().min(1, "Ward number is required"),
  bedNo: z.string().min(1, "Bed number is required"),
  status: z.string().optional().default("Pending"),
  billItems: z.array(billItemSchema).min(1, "At least one bill item is required")
});

export const employeeSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  fathersName: z.string().min(1, "Father's name is required"),
  dateOfRegistration: z.string().transform((val) => new Date(val)),
  contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  email: z.string().email().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  maritalStatus: z.enum(["Married", "Unmarried"]),
  aadharNo: z.string().length(12, "Aadhar must be 12 digits").optional(),
  voterId: z.string().min(1, "Voter ID is required").optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .optional(),
  department: z.string().min(1, "Department is required"),
  photoUrl: z.string().optional(),
});

export const moneyReceiptSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  patientName: z.string().min(1, "Patient name is required"),
  mobile: z.string().min(10, "Mobile must be at least 10 digits"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  paymentMode: z.enum(["Cash", "Cheque", "Card", "Online Transfer", "Other"]),
  remarks: z.string().optional(),
  receivedBy: z.string().min(1, "Received by is required"),
  status: z
    .enum(["Active", "Cancelled", "Refunded"])
    .optional()
    .default("Active"),
});

export const voucherSchema = z.object({
  voucherDate: z.string().transform((val) => new Date(val)),
  paymentFor: z.string().min(1, "Payment for is required"),
  voucherType: z.enum(["Payment", "Receipt", "Journal"]),
  vendorName: z.string().min(1, "Vendor name is required"),
  paymentDate: z
    .string()
    .min(1, "Payment date is required")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  amount: z.number().min(0.01, "Amount must be positive"),
  paymentMode: z.enum(["Cash", "Cheque", "Bank Transfer", "Card", "Online"]),
  referenceNo: z.string().optional(),
  description: z.string().optional(),
  status: z
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

export const brandSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),

   brandLogo: z.string().optional().nullable(),

  description: z.string().min(1, "Description is required"),

  status: z.enum(["Active", "Inactive"]).default("Active"),
});

export const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  productCode: z.string().min(1, "Product code is required"),
  parentCategory: z.string().min(1, "Parent category is required"),
  subCategory: z.string().min(1, "Sub category is required"),
  categoryLogo: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().min(0, "Price must be positive"),
  taxRate: z.number().min(0, "Tax rate must be positive"),
  status: z.string().optional().default("Active"),
});

export const materialSpecSchema = z.object({
  uom: z.string().min(1, "UOM is required"),
  description: z.string().optional(),
  alterUnit: z.string().optional(),
  alterUnitValue: z.number().optional(),
  serialUniqueNo: z.string().optional(),
});

export const productMaterialSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  productName: z.string().min(1, "Product name is required"),
  shortDescription: z.string().optional(),
  hsnCode: z.string().min(1, "HSN Code is required"),
  gstPercentage: z.string().min(1, "GST Percentage is required"),
  status: z.string().default("Active"),
  specifications: z.array(materialSpecSchema).optional(),
});

export const serviceChargeSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  category: z.string().min(1, "Category is required"),
  chargeType: z.string().min(1, "Charge type is required"),
  baseAmount: z.number().min(0, "Base amount must be positive"),
  taxApplicable: z.boolean().default(false),
  taxPercentage: z.number().min(0).max(100).optional(),
  status: z.string().optional().default("Active"),
  notes: z.string().optional(),
});

////////////// ledger

export const bankLedgerSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  date: z.coerce.date(),
  description: z.string().min(1, "Description is required"),
  amountType: z.enum(["Credit", "Debit"]),
  amount: z.number().positive("Amount must be positive"),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

export const cashLedgerSchema = z.object({
  date: z.coerce.date(),
  purpose: z.string().min(1, "Purpose is required"),
  amountType: z.enum(["Income", "Expense"]),
  amount: z.number().positive("Amount must be positive"),
  remarks: z.string().optional(),
});

export const diagnosticsLedgerSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  date: z.coerce.date(),
  testName: z.string().min(1, "Test name is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  attachReport: z.string().url().nullable().optional(),
  remarks: z.string().optional(),
});

export const doctorLedgerSchema = z.object({
  doctorName: z.string().min(1, "Doctor name is required"),
  date: z.coerce.date(),
  description: z.string().min(1, "Description is required"),
  amountType: z.enum(["Credit", "Debit"]),
  amount: z.number().positive("Amount must be positive"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

export const expenseLedgerSchema = z.object({
  expenseCategory: z.string().min(1, "Expense category is required"),
  date: z.coerce.date(),
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

// src/schemas/insuranceLedgerSchema.ts
export const insuranceLedgerSchema = z.object({
  patientName: z.string().min(1),
  tpaInsuranceCompany: z.string().min(1),
  claimAmount: z.number().positive(),
  approvedAmount: z.number().min(0).optional(),
  settledAmount: z.number().min(0).optional(),
  status: z.enum([
    "Pending",
    "Approved",
    "Rejected",
    "Partially Approved",
    "Settled",
  ]),
  remarks: z.string().optional(),
  claimDate: z.coerce.date(),
  approvalDate: z.coerce.date().optional(),
  settlementDate: z.coerce.date().optional(),
});

export const patientLedgerSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  date: z.coerce.date(),
  description: z.string().min(1, "Description is required"),
  amountType: z.enum(["Credit", "Debit"]),
  amount: z.number().positive("Amount must be positive"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

export const pharmacyLedgerSchema = z.object({
  date: z.coerce.date(),
  medicineName: z.string().min(1, "Medicine name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  amountType: z.enum(["Income", "Expense"]),
  amount: z.number().positive("Amount must be positive"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  remarks: z.string().optional(),
});

export const supplierLedgerSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required"),
  date: z.coerce.date(),
  invoiceNo: z.string().min(1, "Invoice number is required"),
  description: z.string().min(1, "Description is required"),
  amountType: z.enum(["Credit", "Debit"]),
  amount: z.number().positive("Amount must be positive"),
  paymentMode: z.string().optional(),
  transactionId: z.string().optional(),
  attachBill: z.string().url().nullable().optional(),
  remarks: z.string().optional(),
});
