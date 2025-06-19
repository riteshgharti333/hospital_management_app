import mongoose, { Schema, Document } from "mongoose";

export interface IBirthRecord extends Document {
  birthDate: Date;
  birthTime: string;
  babySex: "male" | "female";
  babyWeight: number;
  fatherName: string;
  motherName: string;
  mobileNumber: string;
  typeOfDelivery: string;
  placeOfBirth: string;
  attendantName: string;
}

const birthRecordSchema: Schema = new Schema(
  {
    birthDate: { type: Date, required: true },
    birthTime: { type: String, required: true },
    babySex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    babyWeight: { type: Number, required: true, min: 0 },
    fatherName: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    mobileNumber: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\d{10}$/.test(v),
        message: (props: { value: string }) => `${props.value} is not a valid 10-digit number`,
      },
    },
    typeOfDelivery: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    attendantName: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const BirthRecord = mongoose.model<IBirthRecord>(
  "BirthRecord",
  birthRecordSchema
);
