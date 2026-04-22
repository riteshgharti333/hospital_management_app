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
export declare const bedSchema: z.ZodObject<{
    bedNumber: z.ZodString;
    wardNumber: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["Available", "Occupied", "Maintenance"]>>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "Available" | "Occupied" | "Maintenance";
    bedNumber: string;
    wardNumber: string;
    description?: string | undefined;
}, {
    bedNumber: string;
    wardNumber: string;
    status?: "Available" | "Occupied" | "Maintenance" | undefined;
    description?: string | undefined;
}>;
export declare const admissionSchema: z.ZodObject<{
    patientId: z.ZodNumber;
    doctorId: z.ZodNumber;
    admissionDate: z.ZodDate;
    dischargeDate: z.ZodEffects<z.ZodOptional<z.ZodDate>, Date | undefined, unknown>;
    status: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    patientId: number;
    doctorId: number;
    admissionDate: Date;
    dischargeDate?: Date | undefined;
}, {
    patientId: number;
    doctorId: number;
    admissionDate: Date;
    status?: string | undefined;
    dischargeDate?: unknown;
}>;
export declare const ambulanceSchema: z.ZodObject<{
    modelName: z.ZodString;
    brand: z.ZodString;
    registrationNo: z.ZodString;
    driverName: z.ZodString;
    driverContact: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["Available", "On-Call", "Maintenance"]>>;
}, "strip", z.ZodTypeAny, {
    status: "Available" | "Maintenance" | "On-Call";
    modelName: string;
    brand: string;
    registrationNo: string;
    driverName: string;
    driverContact: string;
}, {
    modelName: string;
    brand: string;
    registrationNo: string;
    driverName: string;
    driverContact: string;
    status?: "Available" | "Maintenance" | "On-Call" | undefined;
}>;
export declare const appointmentSchema: z.ZodObject<{
    appointmentDate: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>;
    doctorName: z.ZodString;
    department: z.ZodString;
    appointmentTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    appointmentDate: Date;
    doctorName: string;
    department: string;
    appointmentTime: string;
}, {
    appointmentDate: string;
    doctorName: string;
    department: string;
    appointmentTime: string;
}>;
export declare const bedAssignmentSchema: z.ZodObject<{
    wardNumber: z.ZodString;
    bedNumber: z.ZodString;
    bedType: z.ZodString;
    patientName: z.ZodString;
    allocateDate: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>;
    dischargeDate: z.ZodEffects<z.ZodOptional<z.ZodDate>, Date | undefined, unknown>;
    status: z.ZodDefault<z.ZodEnum<["Active", "Discharged", "Transferred"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "Active" | "Discharged" | "Transferred";
    bedNumber: string;
    wardNumber: string;
    bedType: string;
    patientName: string;
    allocateDate: Date;
    dischargeDate?: Date | undefined;
    notes?: string | undefined;
}, {
    bedNumber: string;
    wardNumber: string;
    bedType: string;
    patientName: string;
    allocateDate: string;
    status?: "Active" | "Discharged" | "Transferred" | undefined;
    dischargeDate?: unknown;
    notes?: string | undefined;
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
export declare const departmentSchema: z.ZodObject<{
    name: z.ZodString;
    head: z.ZodString;
    contactNumber: z.ZodString;
    email: z.ZodString;
    location: z.ZodString;
    description: z.ZodString;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    name: string;
    email: string;
    description: string;
    head: string;
    contactNumber: string;
    location: string;
}, {
    name: string;
    email: string;
    description: string;
    head: string;
    contactNumber: string;
    location: string;
    status?: string | undefined;
}>;
export declare const doctorSchema: z.ZodObject<{
    fullName: z.ZodString;
    mobileNumber: z.ZodString;
    email: z.ZodString;
    qualification: z.ZodString;
    designation: z.ZodString;
    department: z.ZodString;
    specialization: z.ZodString;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    email: string;
    department: string;
    mobileNumber: string;
    fullName: string;
    qualification: string;
    designation: string;
    specialization: string;
}, {
    email: string;
    department: string;
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
    department: string;
    mobileNumber: string;
    fullName: string;
    address: string;
}, {
    shift: string;
    email: string;
    department: string;
    mobileNumber: string;
    fullName: string;
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
export declare const pharmacistSchema: z.ZodObject<{
    fullName: z.ZodString;
    mobileNumber: z.ZodString;
    registrationNo: z.ZodString;
    address: z.ZodString;
    department: z.ZodString;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    registrationNo: string;
    department: string;
    mobileNumber: string;
    fullName: string;
    address: string;
}, {
    registrationNo: string;
    department: string;
    mobileNumber: string;
    fullName: string;
    address: string;
    status?: string | undefined;
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
    status: "ACTIVE" | "COMPLETED" | "CANCELLED";
    admissionId: number;
    medicines: {
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string | undefined;
    }[];
    notes?: string | undefined;
    prescriptionDate?: string | undefined;
    prescriptionDoc?: string | undefined;
}, {
    admissionId: number;
    medicines: {
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string | undefined;
    }[];
    status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | undefined;
    notes?: string | undefined;
    prescriptionDate?: string | undefined;
    prescriptionDoc?: string | undefined;
}>;
export declare const prescriptionFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "COMPLETED", "CANCELLED"]>>;
    admissionId: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | undefined;
    admissionId?: string | undefined;
    fromDate?: string | undefined;
    toDate?: string | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}, {
    status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | undefined;
    admissionId?: string | undefined;
    fromDate?: string | undefined;
    toDate?: string | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export declare const xrayReportSchema: z.ZodObject<{
    billDate: z.ZodDate;
    patientMobile: z.ZodString;
    patientName: z.ZodString;
    patientSex: z.ZodEnum<["Male", "Female", "Other"]>;
    age: z.ZodNumber;
    referredDoctor: z.ZodString;
    testDate: z.ZodDate;
    reportDate: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>;
    patientAddress: z.ZodOptional<z.ZodString>;
    examDescription: z.ZodString;
    department: z.ZodString;
    billAmount: z.ZodNumber;
    discountPercent: z.ZodNumber;
    netBillAmount: z.ZodNumber;
    commissionPercent: z.ZodNumber;
    doctorEarning: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    department: string;
    patientName: string;
    billDate: Date;
    patientMobile: string;
    patientSex: "Male" | "Female" | "Other";
    age: number;
    referredDoctor: string;
    testDate: Date;
    reportDate: Date;
    examDescription: string;
    billAmount: number;
    discountPercent: number;
    netBillAmount: number;
    commissionPercent: number;
    doctorEarning: number;
    patientAddress?: string | undefined;
}, {
    department: string;
    patientName: string;
    billDate: Date;
    patientMobile: string;
    patientSex: "Male" | "Female" | "Other";
    age: number;
    referredDoctor: string;
    testDate: Date;
    reportDate: string;
    examDescription: string;
    billAmount: number;
    discountPercent: number;
    netBillAmount: number;
    commissionPercent: number;
    doctorEarning: number;
    patientAddress?: string | undefined;
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
    patientName: string;
    address: string;
    billDate: Date;
    patientSex: "Male" | "Female" | "Other";
    totalAmount: number;
    billType: string;
    mobile: string;
    admissionNo: string;
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
    patientName: string;
    address: string;
    billDate: Date;
    patientSex: "Male" | "Female" | "Other";
    totalAmount: number;
    billType: string;
    mobile: string;
    admissionNo: string;
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
export declare const employeeSchema: z.ZodObject<{
    employeeName: z.ZodString;
    fathersName: z.ZodString;
    dateOfRegistration: z.ZodEffects<z.ZodString, Date, string>;
    contactNo: z.ZodString;
    dateOfBirth: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>;
    email: z.ZodOptional<z.ZodString>;
    gender: z.ZodEnum<["Male", "Female", "Other"]>;
    maritalStatus: z.ZodEnum<["Married", "Unmarried"]>;
    aadharNo: z.ZodOptional<z.ZodString>;
    voterId: z.ZodOptional<z.ZodString>;
    bloodGroup: z.ZodOptional<z.ZodEnum<["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]>>;
    department: z.ZodString;
    photoUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    department: string;
    fathersName: string;
    dateOfBirth: Date;
    gender: "Male" | "Female" | "Other";
    employeeName: string;
    dateOfRegistration: Date;
    contactNo: string;
    maritalStatus: "Married" | "Unmarried";
    email?: string | undefined;
    aadharNo?: string | undefined;
    voterId?: string | undefined;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
    photoUrl?: string | undefined;
}, {
    department: string;
    fathersName: string;
    dateOfBirth: string;
    gender: "Male" | "Female" | "Other";
    employeeName: string;
    dateOfRegistration: string;
    contactNo: string;
    maritalStatus: "Married" | "Unmarried";
    email?: string | undefined;
    aadharNo?: string | undefined;
    voterId?: string | undefined;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
    photoUrl?: string | undefined;
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
    patientName: string;
    mobile: string;
    admissionNo: string;
    amount: number;
    paymentMode: "Other" | "Cash" | "Cheque" | "Card" | "Online Transfer";
    receivedBy: string;
    remarks?: string | undefined;
}, {
    date: string;
    patientName: string;
    mobile: string;
    admissionNo: string;
    amount: number;
    paymentMode: "Other" | "Cash" | "Cheque" | "Card" | "Online Transfer";
    receivedBy: string;
    status?: "Active" | "Cancelled" | "Refunded" | undefined;
    remarks?: string | undefined;
}>;
export declare const voucherSchema: z.ZodObject<{
    voucherDate: z.ZodEffects<z.ZodString, Date, string>;
    paymentFor: z.ZodString;
    voucherType: z.ZodEnum<["Payment", "Receipt", "Journal"]>;
    vendorName: z.ZodString;
    paymentDate: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>;
    amount: z.ZodNumber;
    paymentMode: z.ZodEnum<["Cash", "Cheque", "Bank Transfer", "Card", "Online"]>;
    referenceNo: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodOptional<z.ZodEnum<["Pending", "Approved", "Rejected", "Paid"]>>>;
}, "strip", z.ZodTypeAny, {
    status: "Pending" | "Paid" | "Approved" | "Rejected";
    amount: number;
    paymentMode: "Cash" | "Cheque" | "Card" | "Bank Transfer" | "Online";
    voucherDate: Date;
    paymentFor: string;
    voucherType: "Payment" | "Receipt" | "Journal";
    vendorName: string;
    paymentDate: Date;
    description?: string | undefined;
    referenceNo?: string | undefined;
}, {
    amount: number;
    paymentMode: "Cash" | "Cheque" | "Card" | "Bank Transfer" | "Online";
    voucherDate: string;
    paymentFor: string;
    voucherType: "Payment" | "Receipt" | "Journal";
    vendorName: string;
    paymentDate: string;
    status?: "Pending" | "Paid" | "Approved" | "Rejected" | undefined;
    description?: string | undefined;
    referenceNo?: string | undefined;
}>;
export declare const brandSchema: z.ZodObject<{
    brandName: z.ZodString;
    description: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["Active", "Inactive"]>>;
}, "strip", z.ZodTypeAny, {
    status: "Active" | "Inactive";
    description: string;
    brandName: string;
}, {
    description: string;
    brandName: string;
    status?: "Active" | "Inactive" | undefined;
}>;
export declare const productSchema: z.ZodObject<{
    productName: z.ZodString;
    productCode: z.ZodString;
    parentCategory: z.ZodString;
    subCategory: z.ZodString;
    categoryLogo: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    unit: z.ZodString;
    price: z.ZodNumber;
    taxRate: z.ZodNumber;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status: string;
    productName: string;
    productCode: string;
    parentCategory: string;
    subCategory: string;
    unit: string;
    price: number;
    taxRate: number;
    description?: string | undefined;
    categoryLogo?: string | undefined;
}, {
    productName: string;
    productCode: string;
    parentCategory: string;
    subCategory: string;
    unit: string;
    price: number;
    taxRate: number;
    status?: string | undefined;
    description?: string | undefined;
    categoryLogo?: string | undefined;
}>;
export declare const materialSpecSchema: z.ZodObject<{
    uom: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    alterUnit: z.ZodOptional<z.ZodString>;
    alterUnitValue: z.ZodOptional<z.ZodNumber>;
    serialUniqueNo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    uom: string;
    description?: string | undefined;
    alterUnit?: string | undefined;
    alterUnitValue?: number | undefined;
    serialUniqueNo?: string | undefined;
}, {
    uom: string;
    description?: string | undefined;
    alterUnit?: string | undefined;
    alterUnitValue?: number | undefined;
    serialUniqueNo?: string | undefined;
}>;
export declare const productMaterialSchema: z.ZodObject<{
    brand: z.ZodString;
    category: z.ZodString;
    productName: z.ZodString;
    shortDescription: z.ZodOptional<z.ZodString>;
    hsnCode: z.ZodString;
    gstPercentage: z.ZodString;
    status: z.ZodDefault<z.ZodString>;
    specifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
        uom: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        alterUnit: z.ZodOptional<z.ZodString>;
        alterUnitValue: z.ZodOptional<z.ZodNumber>;
        serialUniqueNo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        uom: string;
        description?: string | undefined;
        alterUnit?: string | undefined;
        alterUnitValue?: number | undefined;
        serialUniqueNo?: string | undefined;
    }, {
        uom: string;
        description?: string | undefined;
        alterUnit?: string | undefined;
        alterUnitValue?: number | undefined;
        serialUniqueNo?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: string;
    brand: string;
    productName: string;
    category: string;
    hsnCode: string;
    gstPercentage: string;
    shortDescription?: string | undefined;
    specifications?: {
        uom: string;
        description?: string | undefined;
        alterUnit?: string | undefined;
        alterUnitValue?: number | undefined;
        serialUniqueNo?: string | undefined;
    }[] | undefined;
}, {
    brand: string;
    productName: string;
    category: string;
    hsnCode: string;
    gstPercentage: string;
    status?: string | undefined;
    shortDescription?: string | undefined;
    specifications?: {
        uom: string;
        description?: string | undefined;
        alterUnit?: string | undefined;
        alterUnitValue?: number | undefined;
        serialUniqueNo?: string | undefined;
    }[] | undefined;
}>;
export declare const serviceChargeSchema: z.ZodObject<{
    serviceName: z.ZodString;
    category: z.ZodString;
    chargeType: z.ZodString;
    baseAmount: z.ZodNumber;
    taxApplicable: z.ZodDefault<z.ZodBoolean>;
    taxPercentage: z.ZodOptional<z.ZodNumber>;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    category: string;
    serviceName: string;
    chargeType: string;
    baseAmount: number;
    taxApplicable: boolean;
    notes?: string | undefined;
    taxPercentage?: number | undefined;
}, {
    category: string;
    serviceName: string;
    chargeType: string;
    baseAmount: number;
    status?: string | undefined;
    notes?: string | undefined;
    taxApplicable?: boolean | undefined;
    taxPercentage?: number | undefined;
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
export declare const bankLedgerSchema: z.ZodObject<{
    bankName: z.ZodString;
    transactionDate: z.ZodEffects<z.ZodDate, Date, unknown>;
    description: z.ZodString;
    amountType: z.ZodEnum<["CREDIT", "DEBIT"]>;
    amount: z.ZodNumber;
    transactionId: z.ZodOptional<z.ZodString>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    amount: number;
    bankName: string;
    transactionDate: Date;
    amountType: "CREDIT" | "DEBIT";
    remarks?: string | undefined;
    transactionId?: string | undefined;
}, {
    description: string;
    amount: number;
    bankName: string;
    amountType: "CREDIT" | "DEBIT";
    remarks?: string | undefined;
    transactionDate?: unknown;
    transactionId?: string | undefined;
}>;
export declare const cashLedgerSchema: z.ZodObject<{
    transactionDate: z.ZodEffects<z.ZodDate, Date, unknown>;
    purpose: z.ZodString;
    amountType: z.ZodEnum<["INCOME", "EXPENSE"]>;
    amount: z.ZodNumber;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    transactionDate: Date;
    amountType: "EXPENSE" | "INCOME";
    purpose: string;
    remarks?: string | undefined;
}, {
    amount: number;
    amountType: "EXPENSE" | "INCOME";
    purpose: string;
    remarks?: string | undefined;
    transactionDate?: unknown;
}>;
export declare const doctorLedgerSchema: z.ZodObject<{
    doctorName: z.ZodString;
    transactionDate: z.ZodEffects<z.ZodDate, Date, unknown>;
    description: z.ZodString;
    amountType: z.ZodEnum<["CREDIT", "DEBIT"]>;
    amount: z.ZodNumber;
    paymentMode: z.ZodEnum<["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"]>;
    transactionId: z.ZodOptional<z.ZodString>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    doctorName: string;
    amount: number;
    paymentMode: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE";
    transactionDate: Date;
    amountType: "CREDIT" | "DEBIT";
    remarks?: string | undefined;
    transactionId?: string | undefined;
}, {
    description: string;
    doctorName: string;
    amount: number;
    paymentMode: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE";
    amountType: "CREDIT" | "DEBIT";
    remarks?: string | undefined;
    transactionDate?: unknown;
    transactionId?: string | undefined;
}>;
export declare const patientLedgerSchema: z.ZodObject<{
    patientName: z.ZodString;
    transactionDate: z.ZodEffects<z.ZodDate, Date, unknown>;
    description: z.ZodString;
    amountType: z.ZodEnum<["CREDIT", "DEBIT"]>;
    amount: z.ZodNumber;
    paymentMode: z.ZodEnum<["CASH", "CARD", "UPI", "BANK_TRANSFER", "CHEQUE"]>;
    transactionId: z.ZodOptional<z.ZodString>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    patientName: string;
    amount: number;
    paymentMode: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE";
    transactionDate: Date;
    amountType: "CREDIT" | "DEBIT";
    remarks?: string | undefined;
    transactionId?: string | undefined;
}, {
    description: string;
    patientName: string;
    amount: number;
    paymentMode: "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "CHEQUE";
    amountType: "CREDIT" | "DEBIT";
    remarks?: string | undefined;
    transactionDate?: unknown;
    transactionId?: string | undefined;
}>;
export declare const diagnosticsLedgerSchema: z.ZodObject<{
    patientName: z.ZodString;
    date: z.ZodDate;
    testName: z.ZodString;
    description: z.ZodString;
    amount: z.ZodNumber;
    paymentMode: z.ZodString;
    attachReport: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    date: Date;
    patientName: string;
    amount: number;
    paymentMode: string;
    testName: string;
    remarks?: string | undefined;
    attachReport?: string | null | undefined;
}, {
    description: string;
    date: Date;
    patientName: string;
    amount: number;
    paymentMode: string;
    testName: string;
    remarks?: string | undefined;
    attachReport?: string | null | undefined;
}>;
export declare const expenseLedgerSchema: z.ZodObject<{
    expenseCategory: z.ZodString;
    date: z.ZodDate;
    description: z.ZodString;
    amount: z.ZodNumber;
    paymentMode: z.ZodString;
    transactionId: z.ZodOptional<z.ZodString>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    date: Date;
    amount: number;
    paymentMode: string;
    expenseCategory: string;
    remarks?: string | undefined;
    transactionId?: string | undefined;
}, {
    description: string;
    date: Date;
    amount: number;
    paymentMode: string;
    expenseCategory: string;
    remarks?: string | undefined;
    transactionId?: string | undefined;
}>;
export declare const insuranceLedgerSchema: z.ZodObject<{
    patientName: z.ZodString;
    tpaInsuranceCompany: z.ZodString;
    claimAmount: z.ZodNumber;
    approvedAmount: z.ZodOptional<z.ZodNumber>;
    settledAmount: z.ZodOptional<z.ZodNumber>;
    status: z.ZodEnum<["Pending", "Approved", "Rejected", "Partially Approved", "Settled"]>;
    remarks: z.ZodOptional<z.ZodString>;
    claimDate: z.ZodDate;
    approvalDate: z.ZodEffects<z.ZodUnion<[z.ZodDate, z.ZodLiteral<"">, z.ZodUndefined]>, Date | undefined, "" | Date | undefined>;
    settlementDate: z.ZodEffects<z.ZodUnion<[z.ZodDate, z.ZodLiteral<"">, z.ZodUndefined]>, Date | undefined, "" | Date | undefined>;
}, "strip", z.ZodTypeAny, {
    status: "Pending" | "Approved" | "Rejected" | "Partially Approved" | "Settled";
    patientName: string;
    tpaInsuranceCompany: string;
    claimAmount: number;
    claimDate: Date;
    remarks?: string | undefined;
    approvedAmount?: number | undefined;
    settledAmount?: number | undefined;
    approvalDate?: Date | undefined;
    settlementDate?: Date | undefined;
}, {
    status: "Pending" | "Approved" | "Rejected" | "Partially Approved" | "Settled";
    patientName: string;
    tpaInsuranceCompany: string;
    claimAmount: number;
    claimDate: Date;
    remarks?: string | undefined;
    approvedAmount?: number | undefined;
    settledAmount?: number | undefined;
    approvalDate?: "" | Date | undefined;
    settlementDate?: "" | Date | undefined;
}>;
export declare const pharmacyLedgerSchema: z.ZodObject<{
    date: z.ZodDate;
    medicineName: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    amountType: z.ZodEnum<["Income", "Expense"]>;
    amount: z.ZodNumber;
    paymentMode: z.ZodString;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    date: Date;
    medicineName: string;
    amount: number;
    paymentMode: string;
    category: string;
    amountType: "Income" | "Expense";
    remarks?: string | undefined;
}, {
    description: string;
    date: Date;
    medicineName: string;
    amount: number;
    paymentMode: string;
    category: string;
    amountType: "Income" | "Expense";
    remarks?: string | undefined;
}>;
export declare const supplierLedgerSchema: z.ZodObject<{
    supplierName: z.ZodString;
    date: z.ZodDate;
    invoiceNo: z.ZodString;
    description: z.ZodString;
    amountType: z.ZodEnum<["Credit", "Debit"]>;
    amount: z.ZodNumber;
    paymentMode: z.ZodOptional<z.ZodString>;
    transactionId: z.ZodOptional<z.ZodString>;
    attachBill: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    date: Date;
    amount: number;
    amountType: "Credit" | "Debit";
    supplierName: string;
    invoiceNo: string;
    paymentMode?: string | undefined;
    remarks?: string | undefined;
    transactionId?: string | undefined;
    attachBill?: string | null | undefined;
}, {
    description: string;
    date: Date;
    amount: number;
    amountType: "Credit" | "Debit";
    supplierName: string;
    invoiceNo: string;
    paymentMode?: string | undefined;
    remarks?: string | undefined;
    transactionId?: string | undefined;
    attachBill?: string | null | undefined;
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
export type CashFilterInput = z.infer<typeof cashFilterSchema>;
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
export type BankFilterInput = z.infer<typeof bankFilterSchema>;
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
export type AdmissionFilterInput = z.infer<typeof admissionFilterSchema>;
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
export type BirthFilterInput = z.infer<typeof birthFilterSchema>;
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
export type PatientFilterInput = z.infer<typeof patientFilterSchema>;
export declare const departmentFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["Active", "Inactive"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "Active" | "Inactive" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
}, {
    status?: "Active" | "Inactive" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export type DepartmentFilterInput = z.infer<typeof departmentFilterSchema>;
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
export type AppointmentFilterInput = z.infer<typeof appointmentFilterSchema>;
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
export type NurseFilterInput = z.infer<typeof nurseFilterSchema>;
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
export type DoctorFilterInput = z.infer<typeof doctorFilterSchema>;
export type PrescriptionFilterInput = z.infer<typeof prescriptionFilterSchema>;
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
export type PatientLedgerFilterInput = z.infer<typeof patientLedgerFilterSchema>;
export declare const bankLedgerFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    amountType: z.ZodOptional<z.ZodEnum<["CREDIT", "DEBIT"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    amountType?: "CREDIT" | "DEBIT" | undefined;
}, {
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    amountType?: "CREDIT" | "DEBIT" | undefined;
}>;
export type BankLedgerFilterInput = z.infer<typeof bankLedgerFilterSchema>;
export declare const cashLedgerFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodString>;
    amountType: z.ZodOptional<z.ZodEnum<["INCOME", "EXPENSE"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    amountType?: "EXPENSE" | "INCOME" | undefined;
}, {
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    amountType?: "EXPENSE" | "INCOME" | undefined;
}>;
export type CashLedgerFilterInput = z.infer<typeof cashLedgerFilterSchema>;
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
export type DoctorLedgerFilterInput = z.infer<typeof doctorLedgerFilterSchema>;
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
    patientSex?: "Male" | "Female" | "Other" | undefined;
    billType?: "OPD" | "IPD" | "Pharmacy" | "Pathology" | "Radiology" | undefined;
}, {
    status?: "Pending" | "PartiallyPaid" | "Paid" | "Cancelled" | "Refunded" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
    patientSex?: "Male" | "Female" | "Other" | undefined;
    billType?: "OPD" | "IPD" | "Pharmacy" | "Pathology" | "Radiology" | undefined;
}>;
export type BillFilterInput = z.infer<typeof billFilterSchema>;
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
export type MoneyReceiptFilterInput = z.infer<typeof moneyReceiptFilterSchema>;
export declare const FilterSchemas: {
    readonly admission: z.ZodObject<{
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
    readonly birth: z.ZodObject<{
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
    readonly patient: z.ZodObject<{
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
    readonly department: z.ZodObject<{
        fromDate: z.ZodOptional<z.ZodDate>;
        toDate: z.ZodOptional<z.ZodDate>;
        limit: z.ZodDefault<z.ZodNumber>;
        cursor: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["Active", "Inactive"]>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        status?: "Active" | "Inactive" | undefined;
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        cursor?: string | undefined;
    }, {
        status?: "Active" | "Inactive" | undefined;
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        cursor?: string | undefined;
        limit?: number | undefined;
    }>;
    readonly appointment: z.ZodObject<{
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
    readonly nurse: z.ZodObject<{
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
    readonly doctor: z.ZodObject<{
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
    readonly prescription: z.ZodObject<{
        fromDate: z.ZodOptional<z.ZodString>;
        toDate: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["ACTIVE", "COMPLETED", "CANCELLED"]>>;
        admissionId: z.ZodOptional<z.ZodString>;
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | undefined;
        admissionId?: string | undefined;
        fromDate?: string | undefined;
        toDate?: string | undefined;
        cursor?: string | undefined;
        limit?: number | undefined;
    }, {
        status?: "ACTIVE" | "COMPLETED" | "CANCELLED" | undefined;
        admissionId?: string | undefined;
        fromDate?: string | undefined;
        toDate?: string | undefined;
        cursor?: string | undefined;
        limit?: number | undefined;
    }>;
    readonly patientLedger: z.ZodObject<{
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
    readonly bankLedger: z.ZodObject<{
        fromDate: z.ZodOptional<z.ZodDate>;
        toDate: z.ZodOptional<z.ZodDate>;
        limit: z.ZodDefault<z.ZodNumber>;
        cursor: z.ZodOptional<z.ZodString>;
        amountType: z.ZodOptional<z.ZodEnum<["CREDIT", "DEBIT"]>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        cursor?: string | undefined;
        amountType?: "CREDIT" | "DEBIT" | undefined;
    }, {
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        cursor?: string | undefined;
        limit?: number | undefined;
        amountType?: "CREDIT" | "DEBIT" | undefined;
    }>;
    readonly cashLedger: z.ZodObject<{
        fromDate: z.ZodOptional<z.ZodDate>;
        toDate: z.ZodOptional<z.ZodDate>;
        limit: z.ZodDefault<z.ZodNumber>;
        cursor: z.ZodOptional<z.ZodString>;
        amountType: z.ZodOptional<z.ZodEnum<["INCOME", "EXPENSE"]>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        cursor?: string | undefined;
        amountType?: "EXPENSE" | "INCOME" | undefined;
    }, {
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        cursor?: string | undefined;
        limit?: number | undefined;
        amountType?: "EXPENSE" | "INCOME" | undefined;
    }>;
    readonly doctorLedger: z.ZodObject<{
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
    readonly bill: z.ZodObject<{
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
        patientSex?: "Male" | "Female" | "Other" | undefined;
        billType?: "OPD" | "IPD" | "Pharmacy" | "Pathology" | "Radiology" | undefined;
    }, {
        status?: "Pending" | "PartiallyPaid" | "Paid" | "Cancelled" | "Refunded" | undefined;
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        cursor?: string | undefined;
        limit?: number | undefined;
        patientSex?: "Male" | "Female" | "Other" | undefined;
        billType?: "OPD" | "IPD" | "Pharmacy" | "Pathology" | "Radiology" | undefined;
    }>;
    readonly moneyReceipt: z.ZodObject<{
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
    readonly cash: z.ZodObject<{
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
    readonly bank: z.ZodObject<{
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
    readonly ledger: z.ZodObject<{
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
};
