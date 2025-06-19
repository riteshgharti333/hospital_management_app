import { z } from "zod";

const zodDateString = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format. Expected YYYY-MM-DD",
  })
  .transform((val) => new Date(val));

const zodOptionalDateString = z
  .string()
  .refine((val) => val === "" || !isNaN(Date.parse(val)), {
    message: "Invalid date format. Expected YYYY-MM-DD or empty string",
  })
  .transform((val) => (val ? new Date(val) : undefined));

// Department
export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  head: z.string().min(1, "Department Head is required"),
  contactNumber: z.string().min(10, "Contact Number is required"),
  email: z.string().email("Invalid Email"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

// Admission

export const createAdmissionSchema = z.object({
  admissionDate: zodDateString,
  dischargeDate: zodOptionalDateString.optional(),

  gsRsRegNo: z.string({
    required_error: "GS/RS Registration No. is required",
  }),

   admissionTime: z.string({
    required_error: "Admission time is required",
  }),

  wardNo: z.string({
    required_error: "Ward Number is required",
  }),

  bedNo: z.string({
    required_error: "Bed Number is required",
  }),

  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood Group is required",
  }),

  aadhaarNo: z.string({
    required_error: "Aadhaar Number is required",
  }),

  urnNo: z.string({
    required_error: "URN Number is required",
  }),

  patientName: z.string({
    required_error: "Patient Name is required",
  }),

  patientAge: z
    .number({
      required_error: "Patient Age is required",
      invalid_type_error: "Patient Age must be a number",
    })
    .min(0, "Age cannot be negative"),

  patientSex: z.enum(["male", "female", "other"], {
    required_error: "Patient Sex is required",
  }),

  guardianType: z.string({
    required_error: "Guardian Type is required",
  }),

  guardianName: z.string({
    required_error: "Guardian Name is required",
  }),

  phoneNo: z
    .string({
      required_error: "Phone Number is required",
    })
    .length(10, "Phone Number must be 10 digits"),

  patientAddress: z.string({
    required_error: "Patient Address is required",
  }),

  bodyWeight: z
    .number({
      required_error: "Body Weight is required",
      invalid_type_error: "Body Weight must be a number",
    })
    .min(0, "Body Weight cannot be negative"),

  bodyHeight: z
    .number({
      required_error: "Body Height is required",
      invalid_type_error: "Body Height must be a number",
    })
    .min(0, "Body Height cannot be negative"),

  literacy: z.string({
    required_error: "Literacy is required",
  }),

  occupation: z.string({
    required_error: "Occupation is required",
  }),

  admissionUnderDoctor: z.string({
    required_error: "Admitting Doctor is required",
  }),

  isDeliveryAdmission: z.boolean({
    required_error: "Delivery Admission status is required",
  }),

  status: z.enum(["active", "discharged", "transferred"], {
    required_error: "Status is required",
  }),
});

// Birth

export const createBirthRecordSchema = z.object({
  birthDate: zodDateString,
  birthTime: z.string({
    required_error: "Birth time is required",
  }),
  babySex: z.enum(["male", "female"], {
    required_error: "Baby sex is required",
  }),
  babyWeight: z
    .number({ required_error: "Baby weight is required" })
    .min(0, "Weight cannot be negative"),
  fatherName: z.string({ required_error: "Father name is required" }),
  motherName: z.string({ required_error: "Mother name is required" }),
  mobileNumber: z
    .string({ required_error: "Mobile number is required" })
    .length(10, "Mobile number must be 10 digits"),
  typeOfDelivery: z.string({ required_error: "Type of delivery is required" }),
  placeOfBirth: z.string({ required_error: "Place of birth is required" }),
  attendantName: z.string({ required_error: "Attendant name is required" }),
});
