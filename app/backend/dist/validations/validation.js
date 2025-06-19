"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBirthRecordSchema = exports.createAdmissionSchema = exports.createDepartmentSchema = void 0;
const zod_1 = require("zod");
const zodDateString = zod_1.z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Expected YYYY-MM-DD",
})
    .transform((val) => new Date(val));
const zodOptionalDateString = zod_1.z
    .string()
    .refine((val) => val === "" || !isNaN(Date.parse(val)), {
    message: "Invalid date format. Expected YYYY-MM-DD or empty string",
})
    .transform((val) => (val ? new Date(val) : undefined));
// Department
exports.createDepartmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Department name is required"),
    head: zod_1.z.string().min(1, "Department Head is required"),
    contactNumber: zod_1.z.string().min(10, "Contact Number is required"),
    email: zod_1.z.string().email("Invalid Email"),
    location: zod_1.z.string().min(1, "Location is required"),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(["active", "inactive"]).default("active"),
});
// Admission
exports.createAdmissionSchema = zod_1.z.object({
    admissionDate: zodDateString,
    dischargeDate: zodOptionalDateString.optional(),
    gsRsRegNo: zod_1.z.string({
        required_error: "GS/RS Registration No. is required",
    }),
    admissionTime: zod_1.z.string({
        required_error: "Admission time is required",
    }),
    wardNo: zod_1.z.string({
        required_error: "Ward Number is required",
    }),
    bedNo: zod_1.z.string({
        required_error: "Bed Number is required",
    }),
    bloodGroup: zod_1.z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        required_error: "Blood Group is required",
    }),
    aadhaarNo: zod_1.z.string({
        required_error: "Aadhaar Number is required",
    }),
    urnNo: zod_1.z.string({
        required_error: "URN Number is required",
    }),
    patientName: zod_1.z.string({
        required_error: "Patient Name is required",
    }),
    patientAge: zod_1.z
        .number({
        required_error: "Patient Age is required",
        invalid_type_error: "Patient Age must be a number",
    })
        .min(0, "Age cannot be negative"),
    patientSex: zod_1.z.enum(["male", "female", "other"], {
        required_error: "Patient Sex is required",
    }),
    guardianType: zod_1.z.string({
        required_error: "Guardian Type is required",
    }),
    guardianName: zod_1.z.string({
        required_error: "Guardian Name is required",
    }),
    phoneNo: zod_1.z
        .string({
        required_error: "Phone Number is required",
    })
        .length(10, "Phone Number must be 10 digits"),
    patientAddress: zod_1.z.string({
        required_error: "Patient Address is required",
    }),
    bodyWeight: zod_1.z
        .number({
        required_error: "Body Weight is required",
        invalid_type_error: "Body Weight must be a number",
    })
        .min(0, "Body Weight cannot be negative"),
    bodyHeight: zod_1.z
        .number({
        required_error: "Body Height is required",
        invalid_type_error: "Body Height must be a number",
    })
        .min(0, "Body Height cannot be negative"),
    literacy: zod_1.z.string({
        required_error: "Literacy is required",
    }),
    occupation: zod_1.z.string({
        required_error: "Occupation is required",
    }),
    admissionUnderDoctor: zod_1.z.string({
        required_error: "Admitting Doctor is required",
    }),
    isDeliveryAdmission: zod_1.z.boolean({
        required_error: "Delivery Admission status is required",
    }),
    status: zod_1.z.enum(["active", "discharged", "transferred"], {
        required_error: "Status is required",
    }),
});
// Birth
exports.createBirthRecordSchema = zod_1.z.object({
    birthDate: zodDateString,
    birthTime: zod_1.z.string({
        required_error: "Birth time is required",
    }),
    babySex: zod_1.z.enum(["male", "female"], {
        required_error: "Baby sex is required",
    }),
    babyWeight: zod_1.z
        .number({ required_error: "Baby weight is required" })
        .min(0, "Weight cannot be negative"),
    fatherName: zod_1.z.string({ required_error: "Father name is required" }),
    motherName: zod_1.z.string({ required_error: "Mother name is required" }),
    mobileNumber: zod_1.z
        .string({ required_error: "Mobile number is required" })
        .length(10, "Mobile number must be 10 digits"),
    typeOfDelivery: zod_1.z.string({ required_error: "Type of delivery is required" }),
    placeOfBirth: zod_1.z.string({ required_error: "Place of birth is required" }),
    attendantName: zod_1.z.string({ required_error: "Attendant name is required" }),
});
