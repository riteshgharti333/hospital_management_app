import { prisma } from "../lib/prisma";

export const STAFF_CONFIG = {
  DOCTOR: {
    prefix: "DOC-",
    table: prisma.doctor,
    regField: "registrationNo",
    role: "DOCTOR",
    nameField: "fullName",
    emailField: "email",
  },

  NURSE: {
    prefix: "NUR-",
    table: prisma.nurse,
    regField: "registrationNo",
    role: "NURSE",
    nameField: "fullName",
    emailField: "email",
  }
} as const;

export type StaffType = keyof typeof STAFF_CONFIG;
