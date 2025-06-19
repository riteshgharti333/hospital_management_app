import mongoose, { Schema, Document } from "mongoose";

export interface IAdmission extends Document {
  admissionDate: Date;
  admissionTime: string;
  dischargeDate?: Date;
  gsRsRegNo: string;
  wardNo: string;
  bedNo: string;
  bloodGroup: string;
  aadhaarNo: string;
  urnNo: string;
  patientName: string;
  patientAge: number;
  patientSex: "male" | "female" | "other";
  guardianType: string;
  guardianName: string;
  phoneNo: string;
  patientAddress: string;
  bodyWeight: number;
  bodyHeight: number;
  literacy: string;
  occupation: string;
  admissionUnderDoctor: string;
  isDeliveryAdmission: boolean;
  status: "active" | "discharged" | "transferred";
}

const admissionSchema: Schema = new Schema(
  {
    admissionDate: {
      type: Date,
      required: [true, "Admission date is required"],
    },
    admissionTime: {
      type: String,
      required: [true, "Admission time is required"],
    },
    dischargeDate: {
      type: Date,
    },
    gsRsRegNo: {
      type: String,
      required: [true, "GS/RS Reg No is required"],
      unique: true,
    },
    wardNo: {
      type: String,
      required: [true, "Ward number is required"],
    },
    bedNo: {
      type: String,
      required: [true, "Bed number is required"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [true, "Blood group is required"],
    },
    aadhaarNo: {
      type: String,
      required: [true, "Aadhaar number is required"],
      validate: {
        validator: function (v: string) {
          return /^\d{12}$/.test(v);
        },
        message: (props: any) =>
          `${props.value} is not a valid Aadhaar number!`,
      },
    },
    urnNo: {
      type: String,
      required: [true, "URN number is required"],
      unique: true,
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    patientAge: {
      type: Number,
      required: [true, "Patient age is required"],
      min: [0, "Age cannot be negative"],
    },
    patientSex: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Patient sex is required"],
    },
    guardianType: {
      type: String,
      required: [true, "Guardian type is required"],
    },
    guardianName: {
      type: String,
      required: [true, "Guardian name is required"],
      trim: true,
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v: string) {
          return /^\d{10}$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },
    patientAddress: {
      type: String,
      required: [true, "Patient address is required"],
    },
    bodyWeight: {
      type: Number,
      required: [true, "Body weight is required"],
      min: [0, "Weight cannot be negative"],
    },
    bodyHeight: {
      type: Number,
      required: [true, "Body height is required"],
      min: [0, "Height cannot be negative"],
    },
    literacy: {
      type: String,
      required: [true, "Literacy status is required"],
    },
    occupation: {
      type: String,
      required: [true, "Occupation is required"],
    },
    admissionUnderDoctor: {
      type: String,
      required: [true, "Admitting doctor name is required"],
    },
    isDeliveryAdmission: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "discharged", "transferred"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Admission = mongoose.model<IAdmission>(
  "Admission",
  admissionSchema
);
