import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Universal Registration Number Generator
 * Format: PREFIX-YYYY-XXXX
 * Counter resets every year.
 */
export const generateRegistrationNumber = async (
  model: any,      // prisma.doctor, prisma.nurse, etc.
  prefix: string,  // "DOC", "NUR", "PAT"
  field: string = "registrationNo" // field name to check
) => {
  const currentYear = new Date().getFullYear();

  // Find last record of this year
  const lastRecord = await model.findFirst({
    where: {
      [field]: {
        startsWith: `${prefix}-${currentYear}`,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  // Extract last counter
  let nextCounter = 1;

  if (lastRecord) {
    const parts = lastRecord[field].split("-");
    const lastCounter = Number(parts[2]);
    nextCounter = lastCounter + 1;
  }

  const padded = String(nextCounter).padStart(4, "0");
  return `${prefix}-${currentYear}-${padded}`;
};
