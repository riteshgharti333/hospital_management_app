import { z } from "zod";
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
    admissionDate: z.ZodDate;
    admissionTime: z.ZodString;
    dischargeDate: z.ZodEffects<z.ZodOptional<z.ZodDate>, Date | undefined, unknown>;
    wardNo: z.ZodString;
    bedNo: z.ZodString;
    bloodGroup: z.ZodString;
    aadhaarNo: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
    patientName: z.ZodString;
    patientAge: z.ZodNumber;
    patientSex: z.ZodString;
    guardianType: z.ZodString;
    guardianName: z.ZodString;
    phoneNo: z.ZodString;
    patientAddress: z.ZodString;
    bodyWeightKg: z.ZodNumber;
    bodyHeightCm: z.ZodNumber;
    literacy: z.ZodString;
    occupation: z.ZodString;
    doctorName: z.ZodString;
    isDelivery: z.ZodEffects<z.ZodDefault<z.ZodBoolean>, boolean, unknown>;
}, "strip", z.ZodTypeAny, {
    admissionDate: Date;
    admissionTime: string;
    wardNo: string;
    bedNo: string;
    bloodGroup: string;
    patientName: string;
    patientAge: number;
    patientSex: string;
    guardianType: string;
    guardianName: string;
    phoneNo: string;
    patientAddress: string;
    bodyWeightKg: number;
    bodyHeightCm: number;
    literacy: string;
    occupation: string;
    doctorName: string;
    isDelivery: boolean;
    dischargeDate?: Date | undefined;
    aadhaarNo?: string | undefined;
}, {
    admissionDate: Date;
    admissionTime: string;
    wardNo: string;
    bedNo: string;
    bloodGroup: string;
    patientName: string;
    patientAge: number;
    patientSex: string;
    guardianType: string;
    guardianName: string;
    phoneNo: string;
    patientAddress: string;
    bodyWeightKg: number;
    bodyHeightCm: number;
    literacy: string;
    occupation: string;
    doctorName: string;
    dischargeDate?: unknown;
    aadhaarNo?: string | undefined;
    isDelivery?: unknown;
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
    doctorName: string;
    appointmentDate: Date;
    department: string;
    appointmentTime: string;
}, {
    doctorName: string;
    appointmentDate: string;
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
    patientName: string;
    bedType: string;
    allocateDate: Date;
    dischargeDate?: Date | undefined;
    notes?: string | undefined;
}, {
    bedNumber: string;
    wardNumber: string;
    patientName: string;
    bedType: string;
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
    name: string;
    email: string;
    status: string;
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
    email: string;
    status: string;
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
    email: string;
    shift: string;
    status: string;
    department: string;
    mobileNumber: string;
    fullName: string;
    address: string;
}, {
    email: string;
    shift: string;
    department: string;
    mobileNumber: string;
    fullName: string;
    address: string;
    status?: string | undefined;
}>;
export declare const patientSchema: z.ZodObject<{
    fullName: z.ZodString;
    age: z.ZodNumber;
    mobileNumber: z.ZodString;
    gender: z.ZodString;
    bedNumber: z.ZodString;
    aadhaarNumber: z.ZodString;
    address: z.ZodString;
    medicalHistory: z.ZodString;
}, "strip", z.ZodTypeAny, {
    bedNumber: string;
    mobileNumber: string;
    fullName: string;
    address: string;
    age: number;
    gender: string;
    aadhaarNumber: string;
    medicalHistory: string;
}, {
    bedNumber: string;
    mobileNumber: string;
    fullName: string;
    address: string;
    age: number;
    gender: string;
    aadhaarNumber: string;
    medicalHistory: string;
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
export declare const medicineSchema: z.ZodObject<{
    medicineName: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    description: string;
    medicineName: string;
}, {
    description: string;
    medicineName: string;
}>;
export declare const prescriptionSchema: z.ZodObject<{
    prescriptionDate: z.ZodDate;
    doctorId: z.ZodNumber;
    patientId: z.ZodNumber;
    prescriptionDoc: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    medicines: z.ZodArray<z.ZodObject<{
        medicineName: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        description: string;
        medicineName: string;
    }, {
        description: string;
        medicineName: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    status: string;
    prescriptionDate: Date;
    doctorId: number;
    patientId: number;
    medicines: {
        description: string;
        medicineName: string;
    }[];
    prescriptionDoc?: string | undefined;
}, {
    prescriptionDate: Date;
    doctorId: number;
    patientId: number;
    medicines: {
        description: string;
        medicineName: string;
    }[];
    status?: string | undefined;
    prescriptionDoc?: string | undefined;
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
    patientName: string;
    patientSex: "Male" | "Female" | "Other";
    department: string;
    age: number;
    billDate: Date;
    patientMobile: string;
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
    patientName: string;
    patientSex: "Male" | "Female" | "Other";
    department: string;
    age: number;
    billDate: Date;
    patientMobile: string;
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
    patientAge: z.ZodNumber;
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
    patientAge: number;
    patientSex: "Male" | "Female" | "Other";
    address: string;
    billDate: Date;
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
    patientAge: number;
    patientSex: "Male" | "Female" | "Other";
    address: string;
    billDate: Date;
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
    gender: "Male" | "Female" | "Other";
    employeeName: string;
    dateOfRegistration: Date;
    contactNo: string;
    dateOfBirth: Date;
    maritalStatus: "Married" | "Unmarried";
    email?: string | undefined;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
    aadharNo?: string | undefined;
    voterId?: string | undefined;
    photoUrl?: string | undefined;
}, {
    department: string;
    fathersName: string;
    gender: "Male" | "Female" | "Other";
    employeeName: string;
    dateOfRegistration: string;
    contactNo: string;
    dateOfBirth: string;
    maritalStatus: "Married" | "Unmarried";
    email?: string | undefined;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
    aadharNo?: string | undefined;
    voterId?: string | undefined;
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
export declare const bankLedgerSchema: z.ZodObject<{
    bankName: z.ZodString;
    date: z.ZodDate;
    description: z.ZodString;
    amountType: z.ZodEnum<["Credit", "Debit"]>;
    amount: z.ZodNumber;
    transactionId: z.ZodOptional<z.ZodString>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    date: Date;
    amount: number;
    bankName: string;
    amountType: "Credit" | "Debit";
    remarks?: string | undefined;
    transactionId?: string | undefined;
}, {
    description: string;
    date: Date;
    amount: number;
    bankName: string;
    amountType: "Credit" | "Debit";
    remarks?: string | undefined;
    transactionId?: string | undefined;
}>;
export declare const cashLedgerSchema: z.ZodObject<{
    date: z.ZodDate;
    purpose: z.ZodString;
    amountType: z.ZodEnum<["Income", "Expense"]>;
    amount: z.ZodNumber;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: Date;
    amount: number;
    amountType: "Income" | "Expense";
    purpose: string;
    remarks?: string | undefined;
}, {
    date: Date;
    amount: number;
    amountType: "Income" | "Expense";
    purpose: string;
    remarks?: string | undefined;
}>;
export declare const doctorLedgerSchema: z.ZodObject<{
    doctorName: z.ZodString;
    date: z.ZodDate;
    description: z.ZodString;
    amountType: z.ZodEnum<["Credit", "Debit"]>;
    amount: z.ZodNumber;
    paymentMode: z.ZodString;
    transactionId: z.ZodOptional<z.ZodString>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    date: Date;
    doctorName: string;
    amount: number;
    paymentMode: string;
    amountType: "Credit" | "Debit";
    remarks?: string | undefined;
    transactionId?: string | undefined;
}, {
    description: string;
    date: Date;
    doctorName: string;
    amount: number;
    paymentMode: string;
    amountType: "Credit" | "Debit";
    remarks?: string | undefined;
    transactionId?: string | undefined;
}>;
export declare const patientLedgerSchema: z.ZodObject<{
    patientName: z.ZodString;
    date: z.ZodDate;
    description: z.ZodString;
    amountType: z.ZodEnum<["Credit", "Debit"]>;
    amount: z.ZodNumber;
    paymentMode: z.ZodString;
    transactionId: z.ZodOptional<z.ZodString>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    description: string;
    date: Date;
    patientName: string;
    amount: number;
    paymentMode: string;
    amountType: "Credit" | "Debit";
    remarks?: string | undefined;
    transactionId?: string | undefined;
}, {
    description: string;
    date: Date;
    patientName: string;
    amount: number;
    paymentMode: string;
    amountType: "Credit" | "Debit";
    remarks?: string | undefined;
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
export declare const admissionFilterSchema: z.ZodObject<{
    patientSex: z.ZodOptional<z.ZodEnum<["Male", "Female", "Other"]>>;
    bloodGroup: z.ZodEffects<z.ZodOptional<z.ZodEnum<["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]>>, string | undefined, "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    bloodGroup?: string | undefined;
    patientSex?: "Male" | "Female" | "Other" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
    patientSex?: "Male" | "Female" | "Other" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export type AdmissionFilterInput = z.infer<typeof admissionFilterSchema>;
export declare const birthFilterSchema: z.ZodObject<{
    babySex: z.ZodOptional<z.ZodEnum<["Male", "Female", "Other"]>>;
    deliveryType: z.ZodOptional<z.ZodEnum<["Normal", "Cesarean", "Forceps", "Vacuum"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    babySex?: "Male" | "Female" | "Other" | undefined;
    deliveryType?: "Normal" | "Cesarean" | "Forceps" | "Vacuum" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    babySex?: "Male" | "Female" | "Other" | undefined;
    deliveryType?: "Normal" | "Cesarean" | "Forceps" | "Vacuum" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export type BirthFilterInput = z.infer<typeof birthFilterSchema>;
export declare const patientFilterSchema: z.ZodObject<{
    gender: z.ZodOptional<z.ZodEnum<["Male", "Female", "Other"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    gender?: "Male" | "Female" | "Other" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    gender?: "Male" | "Female" | "Other" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export type PatientFilterInput = z.infer<typeof patientFilterSchema>;
export declare const departmentFilterSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["Active", "Inactive"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "Active" | "Inactive" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    status?: "Active" | "Inactive" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export type DepartmentFilterInput = z.infer<typeof departmentFilterSchema>;
export declare const appointmentFilterSchema: z.ZodObject<{
    department: z.ZodOptional<z.ZodString>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    department?: string | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    department?: string | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export type AppointmentFilterInput = z.infer<typeof appointmentFilterSchema>;
export declare const nurseFilterSchema: z.ZodObject<{
    shift: z.ZodOptional<z.ZodEnum<["Day", "Night", "Rotating"]>>;
    status: z.ZodOptional<z.ZodEnum<["Active", "Inactive", "On Leave"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    shift?: "Day" | "Night" | "Rotating" | undefined;
    status?: "Active" | "Inactive" | "On Leave" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    shift?: "Day" | "Night" | "Rotating" | undefined;
    status?: "Active" | "Inactive" | "On Leave" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export type NurseFilterInput = z.infer<typeof nurseFilterSchema>;
export declare const doctorFilterSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["Active", "Inactive", "On Leave"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "Active" | "Inactive" | "On Leave" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    status?: "Active" | "Inactive" | "On Leave" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export type DoctorFilterInput = z.infer<typeof doctorFilterSchema>;
export declare const prescriptionFilterSchema: z.ZodObject<{
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export type PrescriptionFilterInput = z.infer<typeof prescriptionFilterSchema>;
export declare const patientLedgerFilterSchema: z.ZodObject<{
    amountType: z.ZodOptional<z.ZodEnum<["Credit", "Debit"]>>;
    paymentMode: z.ZodOptional<z.ZodEnum<["Cash", "Card", "UPI", "Insurance"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    paymentMode?: "Cash" | "Card" | "UPI" | "Insurance" | undefined;
    amountType?: "Credit" | "Debit" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    paymentMode?: "Cash" | "Card" | "UPI" | "Insurance" | undefined;
    amountType?: "Credit" | "Debit" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export declare const bankLedgerFilterSchema: z.ZodObject<{
    amountType: z.ZodOptional<z.ZodEnum<["Credit", "Debit"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    amountType?: "Credit" | "Debit" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    amountType?: "Credit" | "Debit" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export declare const cashLedgerFilterSchema: z.ZodObject<{
    amountType: z.ZodOptional<z.ZodEnum<["Income", "Expense"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    amountType?: "Income" | "Expense" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    amountType?: "Income" | "Expense" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export declare const doctorLedgerFilterSchema: z.ZodObject<{
    amountType: z.ZodOptional<z.ZodEnum<["Credit", "Debit"]>>;
    paymentMode: z.ZodOptional<z.ZodEnum<["Cash", "UPI", "Bank"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    paymentMode?: "Cash" | "UPI" | "Bank" | undefined;
    amountType?: "Credit" | "Debit" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    paymentMode?: "Cash" | "UPI" | "Bank" | undefined;
    amountType?: "Credit" | "Debit" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export declare const billFilterSchema: z.ZodObject<{
    billType: z.ZodOptional<z.ZodEnum<["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"]>>;
    patientSex: z.ZodOptional<z.ZodEnum<["Male", "Female", "Other"]>>;
    status: z.ZodOptional<z.ZodEnum<["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "Pending" | "PartiallyPaid" | "Paid" | "Cancelled" | "Refunded" | undefined;
    patientSex?: "Male" | "Female" | "Other" | undefined;
    billType?: "OPD" | "IPD" | "Pharmacy" | "Pathology" | "Radiology" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    status?: "Pending" | "PartiallyPaid" | "Paid" | "Cancelled" | "Refunded" | undefined;
    patientSex?: "Male" | "Female" | "Other" | undefined;
    billType?: "OPD" | "IPD" | "Pharmacy" | "Pathology" | "Radiology" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
export declare const moneyReceiptFilterSchema: z.ZodObject<{
    paymentMode: z.ZodOptional<z.ZodEnum<["Cash", "Cheque", "Card", "Online Transfer", "Other"]>>;
    status: z.ZodOptional<z.ZodEnum<["Active", "Cancelled", "Refunded"]>>;
    fromDate: z.ZodOptional<z.ZodDate>;
    toDate: z.ZodOptional<z.ZodDate>;
    limit: z.ZodDefault<z.ZodNumber>;
    cursor: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    status?: "Active" | "Cancelled" | "Refunded" | undefined;
    paymentMode?: "Other" | "Cash" | "Cheque" | "Card" | "Online Transfer" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    cursor?: number | undefined;
}, {
    status?: "Active" | "Cancelled" | "Refunded" | undefined;
    paymentMode?: "Other" | "Cash" | "Cheque" | "Card" | "Online Transfer" | undefined;
    fromDate?: Date | undefined;
    toDate?: Date | undefined;
    limit?: number | undefined;
    cursor?: number | undefined;
}>;
