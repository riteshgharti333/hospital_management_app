import { z } from "zod";
export declare const changePasswordSchema: z.ZodEffects<z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}>, {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}>;
export declare const registerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const admissionSchema: z.ZodObject<{
    patientId: z.ZodNumber;
    status: z.ZodDefault<z.ZodEnum<["ACTIVE", "DISCHARGED", "CANCELLED"]>>;
    doctorId: z.ZodNumber;
    admissionDate: z.ZodDate;
    dischargeDate: z.ZodEffects<z.ZodOptional<z.ZodDate>, Date | undefined, unknown>;
}, "strip", z.ZodTypeAny, {
    status: "ACTIVE" | "DISCHARGED" | "CANCELLED";
    patientId: number;
    doctorId: number;
    admissionDate: Date;
    dischargeDate?: Date | undefined;
}, {
    patientId: number;
    doctorId: number;
    admissionDate: Date;
    status?: "ACTIVE" | "DISCHARGED" | "CANCELLED" | undefined;
    dischargeDate?: unknown;
}>;
export declare const birthSchema: z.ZodObject<{
    birthTime: z.ZodString;
    birthDate: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>;
    babySex: z.ZodString;
    babyWeightKg: z.ZodNumber;
    fathersName: z.ZodString;
    mothersName: z.ZodString;
    mobileNumber: z.ZodString;
    deliveryType: z.ZodString;
    placeOfBirth: z.ZodString;
    attendantsName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    birthTime: string;
    birthDate: Date;
    babySex: string;
    babyWeightKg: number;
    fathersName: string;
    mothersName: string;
    mobileNumber: string;
    deliveryType: string;
    placeOfBirth: string;
    attendantsName: string;
}, {
    birthTime: string;
    birthDate: string;
    babySex: string;
    babyWeightKg: number;
    fathersName: string;
    mothersName: string;
    mobileNumber: string;
    deliveryType: string;
    placeOfBirth: string;
    attendantsName: string;
}>;
export declare const DepartmentStatusEnum: z.ZodEnum<["ACTIVE", "INACTIVE"]>;
export declare const DepartmentNameEnum: z.ZodEnum<["CARDIOLOGY", "NEUROLOGY", "ORTHOPEDICS", "PEDIATRICS", "DERMATOLOGY", "GENERAL"]>;
export declare const departmentSchema: z.ZodObject<{
    name: z.ZodEnum<["CARDIOLOGY", "NEUROLOGY", "ORTHOPEDICS", "PEDIATRICS", "DERMATOLOGY", "GENERAL"]>;
    description: z.ZodOptional<z.ZodString>;
    doctorId: z.ZodNumber;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE"]>>>;
}, "strip", z.ZodTypeAny, {
    status: "ACTIVE" | "INACTIVE";
    name: "CARDIOLOGY" | "NEUROLOGY" | "ORTHOPEDICS" | "PEDIATRICS" | "DERMATOLOGY" | "GENERAL";
    doctorId: number;
    description?: string | undefined;
}, {
    name: "CARDIOLOGY" | "NEUROLOGY" | "ORTHOPEDICS" | "PEDIATRICS" | "DERMATOLOGY" | "GENERAL";
    doctorId: number;
    status?: "ACTIVE" | "INACTIVE" | undefined;
    description?: string | undefined;
}>;
export declare const AppointmentStatus: z.ZodEnum<["BOOKED", "CANCELLED", "EXPIRED"]>;
export declare const appointmentSchema: z.ZodObject<{
    appointmentDate: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>;
    appointmentTime: z.ZodString;
    doctorId: z.ZodNumber;
    status: z.ZodOptional<z.ZodEnum<["BOOKED", "CANCELLED", "EXPIRED"]>>;
}, "strip", z.ZodTypeAny, {
    doctorId: number;
    appointmentDate: Date;
    appointmentTime: string;
    status?: "CANCELLED" | "BOOKED" | "EXPIRED" | undefined;
}, {
    doctorId: number;
    appointmentDate: string;
    appointmentTime: string;
    status?: "CANCELLED" | "BOOKED" | "EXPIRED" | undefined;
}>;
export declare const doctorSchema: z.ZodObject<{
    fullName: z.ZodString;
    mobileNumber: z.ZodString;
    email: z.ZodString;
    qualification: z.ZodString;
    designation: z.ZodString;
    specialization: z.ZodString;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    email: string;
    mobileNumber: string;
    fullName: string;
    qualification: string;
    designation: string;
    specialization: string;
}, {
    email: string;
    mobileNumber: string;
    fullName: string;
    qualification: string;
    designation: string;
    specialization: string;
    status?: string | undefined;
}>;
export declare const nurseSchema: z.ZodObject<{
    fullName: z.ZodString;
    mobileNumber: z.ZodString;
    department: z.ZodString;
    address: z.ZodString;
    email: z.ZodString;
    shift: z.ZodString;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    shift: string;
    status: string;
    email: string;
    mobileNumber: string;
    fullName: string;
    department: string;
    address: string;
}, {
    shift: string;
    email: string;
    mobileNumber: string;
    fullName: string;
    department: string;
    address: string;
    status?: string | undefined;
}>;
export declare const patientSchema: z.ZodObject<{
    fullName: z.ZodString;
    dateOfBirth: z.ZodDate;
    gender: z.ZodString;
    mobileNumber: z.ZodOptional<z.ZodString>;
    aadhaarNumber: z.ZodOptional<z.ZodString>;
    address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    address: string;
    dateOfBirth: Date;
    gender: string;
    mobileNumber?: string | undefined;
    aadhaarNumber?: string | undefined;
}, {
    fullName: string;
    address: string;
    dateOfBirth: Date;
    gender: string;
    mobileNumber?: string | undefined;
    aadhaarNumber?: string | undefined;
}>;
export declare const PrescriptionStatusEnum: z.ZodEnum<["ACTIVE", "COMPLETED", "CANCELLED"]>;
export declare const medicineSchema: z.ZodObject<{
    medicineName: z.ZodString;
    dosage: z.ZodString;
    frequency: z.ZodString;
    duration: z.ZodString;
    instructions: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string | undefined;
}, {
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string | undefined;
}>;
export declare const prescriptionSchema: z.ZodObject<{
    admissionId: z.ZodNumber;
    prescriptionDate: z.ZodOptional<z.ZodString>;
    prescriptionDoc: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ACTIVE", "COMPLETED", "CANCELLED"]>>>;
    medicines: z.ZodArray<z.ZodObject<{
        medicineName: z.ZodString;
        dosage: z.ZodString;
        frequency: z.ZodString;
        duration: z.ZodString;
        instructions: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string | undefined;
    }, {
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "ACTIVE" | "CANCELLED" | "COMPLETED";
    admissionId: number;
    medicines: {
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string | undefined;
    }[];
    prescriptionDate?: string | undefined;
    prescriptionDoc?: string | undefined;
    notes?: string | undefined;
}, {
    admissionId: number;
    medicines: {
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string | undefined;
    }[];
    status?: "ACTIVE" | "CANCELLED" | "COMPLETED" | undefined;
    prescriptionDate?: string | undefined;
    prescriptionDoc?: string | undefined;
    notes?: string | undefined;
}>;
export declare const prescriptionFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "COMPLETED", "CANCELLED"]>>;
    admissionId: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "CANCELLED" | "COMPLETED" | undefined;
    admissionId?: string | undefined;
    fromDate?: string | undefined;
    toDate?: string | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}, {
    status?: "ACTIVE" | "CANCELLED" | "COMPLETED" | undefined;
    admissionId?: string | undefined;
    fromDate?: string | undefined;
    toDate?: string | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const billItemSchema: z.ZodObject<{
    company: z.ZodString;
    itemOrService: z.ZodString;
    quantity: z.ZodNumber;
    mrp: z.ZodNumber;
    totalAmount: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    company: string;
    itemOrService: string;
    quantity: number;
    mrp: number;
    totalAmount?: number | undefined;
}, {
    company: string;
    itemOrService: string;
    quantity: number;
    mrp: number;
    totalAmount?: number | undefined;
}>;
export declare const billSchema: z.ZodObject<{
    billDate: z.ZodDate;
    billType: z.ZodString;
    totalAmount: z.ZodNumber;
    mobile: z.ZodString;
    patientName: z.ZodString;
    admissionNo: z.ZodString;
    admissionDate: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>;
    patientSex: z.ZodEnum<["Male", "Female", "Other"]>;
    dischargeDate: z.ZodEffects<z.ZodOptional<z.ZodDate>, Date | undefined, unknown>;
    address: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"]>>;
    billItems: z.ZodArray<z.ZodObject<{
        company: z.ZodString;
        itemOrService: z.ZodString;
        quantity: z.ZodNumber;
        mrp: z.ZodNumber;
        totalAmount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        company: string;
        itemOrService: string;
        quantity: number;
        mrp: number;
        totalAmount?: number | undefined;
    }, {
        company: string;
        itemOrService: string;
        quantity: number;
        mrp: number;
        totalAmount?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: "Pending" | "PartiallyPaid" | "Paid" | "Cancelled" | "Refunded";
    admissionDate: Date;
    address: string;
    totalAmount: number;
    billDate: Date;
    billType: string;
    mobile: string;
    patientName: string;
    admissionNo: string;
    patientSex: "Male" | "Female" | "Other";
    billItems: {
        company: string;
        itemOrService: string;
        quantity: number;
        mrp: number;
        totalAmount?: number | undefined;
    }[];
    dischargeDate?: Date | undefined;
}, {
    admissionDate: string;
    address: string;
    totalAmount: number;
    billDate: Date;
    billType: string;
    mobile: string;
    patientName: string;
    admissionNo: string;
    patientSex: "Male" | "Female" | "Other";
    billItems: {
        company: string;
        itemOrService: string;
        quantity: number;
        mrp: number;
        totalAmount?: number | undefined;
    }[];
    status?: "Pending" | "PartiallyPaid" | "Paid" | "Cancelled" | "Refunded" | undefined;
    dischargeDate?: unknown;
}>;
export declare const moneyReceiptSchema: z.ZodObject<{
    date: z.ZodEffects<z.ZodString, Date, string>;
    patientName: z.ZodString;
    mobile: z.ZodString;
    admissionNo: z.ZodString;
    amount: z.ZodNumber;
    paymentMode: z.ZodEnum<["Cash", "Cheque", "Card", "Online Transfer", "Other"]>;
    remarks: z.ZodOptional<z.ZodString>;
    receivedBy: z.ZodString;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<["Active", "Cancelled", "Refunded"]>>>;
}, "strip", z.ZodTypeAny, {
    status: "Active" | "Cancelled" | "Refunded";
    date: Date;
    mobile: string;
    patientName: string;
    admissionNo: string;
    amount: number;
    paymentMode: "Other" | "Cash" | "Cheque" | "Card" | "Online Transfer";
    receivedBy: string;
    remarks?: string | undefined;
}, {
    date: string;
    mobile: string;
    patientName: string;
    admissionNo: string;
    amount: number;
    paymentMode: "Other" | "Cash" | "Cheque" | "Card" | "Online Transfer";
    receivedBy: string;
    status?: "Active" | "Cancelled" | "Refunded" | undefined;
    remarks?: string | undefined;
}>;
export declare const cashSchema: z.ZodObject<{
    cashName: z.ZodString;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    cashName: string;
    isActive?: boolean | undefined;
}, {
    cashName: string;
    isActive?: boolean | undefined;
}>;
export declare const bankSchema: z.ZodObject<{
    bankName: z.ZodString;
    accountNo: z.ZodString;
    ifscCode: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    bankName: string;
    accountNo: string;
    isActive?: boolean | undefined;
    ifscCode?: string | undefined;
}, {
    bankName: string;
    accountNo: string;
    isActive?: boolean | undefined;
    ifscCode?: string | undefined;
}>;
export declare const AmountTypeEnum: z.ZodEnum<["CREDIT", "DEBIT"]>;
export declare const PaymentModeEnum: z.ZodEnum<["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"]>;
export declare const ENTITY_TYPES: readonly ["PATIENT", "DOCTOR", "BANK", "CASH"];
export declare const REFERENCE_TYPES: readonly ["OPD", "IPD", "PHARMACY", "LAB", "PROCEDURE", "SALARY", "EXPENSE", "ADVANCE", "REFUND", "OTHER"];
export declare const ledgerSchema: z.ZodObject<{
    entityType: z.ZodEffects<z.ZodString, string, string>;
    entityId: z.ZodString;
    transactionDate: z.ZodEffects<z.ZodDate, Date, unknown>;
    description: z.ZodString;
    amountType: z.ZodEffects<z.ZodEnum<["CREDIT", "DEBIT"]>, "CREDIT" | "DEBIT", "CREDIT" | "DEBIT">;
    amount: z.ZodNumber;
    paymentMode: z.ZodOptional<z.ZodEnum<["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"]>>;
    referenceType: z.ZodEffects<z.ZodOptional<z.ZodEffects<z.ZodString, string | undefined, string>>, string | undefined, string | undefined>;
    referenceId: z.ZodOptional<z.ZodString>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    amount: number;
    entityType: string;
    entityId: string;
    transactionDate: Date;
    amountType: "CREDIT" | "DEBIT";
    paymentMode?: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | undefined;
    remarks?: string | undefined;
    referenceType?: string | undefined;
    referenceId?: string | undefined;
}, {
    description: string;
    amount: number;
    entityType: string;
    entityId: string;
    amountType: "CREDIT" | "DEBIT";
    paymentMode?: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | undefined;
    remarks?: string | undefined;
    transactionDate?: unknown;
    referenceType?: string | undefined;
    referenceId?: string | undefined;
}>;
export declare const ledgerFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    entityType: z.ZodOptional<z.ZodEnum<["PATIENT", "DOCTOR", "BANK", "CASH"]>>;
    amountType: z.ZodOptional<z.ZodEnum<["CREDIT", "DEBIT"]>>;
    paymentMode: z.ZodOptional<z.ZodEnum<["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    paymentMode?: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | undefined;
    entityType?: "CASH" | "PATIENT" | "DOCTOR" | "BANK" | undefined;
    amountType?: "CREDIT" | "DEBIT" | undefined;
}, {
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    paymentMode?: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | undefined;
    entityType?: "CASH" | "PATIENT" | "DOCTOR" | "BANK" | undefined;
    amountType?: "CREDIT" | "DEBIT" | undefined;
}>;
export declare const cashFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    isActive: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean, "true" | "false" | undefined>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    isActive: boolean;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    isActive?: "true" | "false" | undefined;
}>;
export declare const bankFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    isActive: z.ZodEffects<z.ZodOptional<z.ZodEnum<["true", "false"]>>, boolean, "true" | "false" | undefined>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    isActive: boolean;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    isActive?: "true" | "false" | undefined;
}>;
export declare const admissionFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<["Male", "Female", "Other"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    gender?: "Male" | "Female" | "Other" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    gender?: "Male" | "Female" | "Other" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const birthFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    babySex: z.ZodOptional<z.ZodEnum<["Male", "Female", "Other"]>>;
    deliveryType: z.ZodOptional<z.ZodEnum<["Normal", "Cesarean", "Forceps", "Vacuum"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    babySex?: "Male" | "Female" | "Other" | undefined;
    deliveryType?: "Normal" | "Cesarean" | "Forceps" | "Vacuum" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    babySex?: "Male" | "Female" | "Other" | undefined;
    deliveryType?: "Normal" | "Cesarean" | "Forceps" | "Vacuum" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const patientFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<["Male", "Female", "Other"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    gender?: "Male" | "Female" | "Other" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    gender?: "Male" | "Female" | "Other" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const departmentFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "INACTIVE"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "ACTIVE" | "INACTIVE" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    status?: "ACTIVE" | "INACTIVE" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const appointmentFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    department: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    department?: string | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    department?: string | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const nurseFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    shift: z.ZodOptional<z.ZodEnum<["Day", "Night", "Rotating"]>>;
    status: z.ZodOptional<z.ZodEnum<["Active", "Inactive", "On Leave"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    shift?: "Day" | "Night" | "Rotating" | undefined;
    status?: "Active" | "Inactive" | "On Leave" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    shift?: "Day" | "Night" | "Rotating" | undefined;
    status?: "Active" | "Inactive" | "On Leave" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const doctorFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["Active", "Inactive", "On Leave"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "Active" | "Inactive" | "On Leave" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    status?: "Active" | "Inactive" | "On Leave" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const patientLedgerFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    amountType: z.ZodOptional<z.ZodEnum<["CREDIT", "DEBIT"]>>;
    paymentMode: z.ZodOptional<z.ZodEnum<["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    paymentMode?: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | undefined;
    amountType?: "CREDIT" | "DEBIT" | undefined;
}, {
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    paymentMode?: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | undefined;
    amountType?: "CREDIT" | "DEBIT" | undefined;
}>;
export declare const doctorLedgerFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    amountType: z.ZodOptional<z.ZodEnum<["CREDIT", "DEBIT"]>>;
    paymentMode: z.ZodOptional<z.ZodEnum<["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    paymentMode?: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | undefined;
    amountType?: "CREDIT" | "DEBIT" | undefined;
}, {
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    paymentMode?: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE" | undefined;
    amountType?: "CREDIT" | "DEBIT" | undefined;
}>;
export declare const billFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    billType: z.ZodOptional<z.ZodEnum<["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"]>>;
    patientSex: z.ZodOptional<z.ZodEnum<["Male", "Female", "Other"]>>;
    status: z.ZodOptional<z.ZodEnum<["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "Pending" | "PartiallyPaid" | "Paid" | "Cancelled" | "Refunded" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    billType?: "OPD" | "IPD" | "Pharmacy" | "Pathology" | "Radiology" | undefined;
    patientSex?: "Male" | "Female" | "Other" | undefined;
}, {
    status?: "Pending" | "PartiallyPaid" | "Paid" | "Cancelled" | "Refunded" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    billType?: "OPD" | "IPD" | "Pharmacy" | "Pathology" | "Radiology" | undefined;
    patientSex?: "Male" | "Female" | "Other" | undefined;
}>;
export declare const moneyReceiptFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    paymentMode: z.ZodOptional<z.ZodEnum<["Cash", "Cheque", "Card", "Online Transfer", "Other"]>>;
    status: z.ZodOptional<z.ZodEnum<["Active", "Cancelled", "Refunded"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "Active" | "Cancelled" | "Refunded" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    paymentMode?: "Other" | "Cash" | "Cheque" | "Card" | "Online Transfer" | undefined;
}, {
    status?: "Active" | "Cancelled" | "Refunded" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    paymentMode?: "Other" | "Cash" | "Cheque" | "Card" | "Online Transfer" | undefined;
}>;
