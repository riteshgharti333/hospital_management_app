import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  head: string;
  contactNumber: string;
  email: string;
  location: string;
  description?: string;
  status: "active" | "inactive";
}

const departmentSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
    },
    head: {
      type: String,
      required: [true, "Department head is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Department = mongoose.model<IDepartment>("Department", departmentSchema);
