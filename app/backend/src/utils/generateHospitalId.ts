import { prisma } from "../lib/prisma";

type GenerateIdOptions = {
  prefix: string;          // PAT / ADM
  model: "patient" | "admission";
  field: string;           // hospitalPatientId / hospitalAdmissionId
};

export const generateHospitalId = async ({
  prefix,
  model,
  field,
}: GenerateIdOptions): Promise<string> => {
  const year = new Date().getFullYear();

  const lastRecord = await (prisma as any)[model].findFirst({
    where: {
      [field]: {
        startsWith: `${prefix}-${year}`,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      [field]: true,
    },
  });

  let nextNumber = 1;

  if (lastRecord?.[field]) {
    const lastSeq = Number(lastRecord[field].split("-")[2]);
    nextNumber = lastSeq + 1;
  }

  const paddedSeq = String(nextNumber).padStart(6, "0");

  return `${prefix}-${year}-${paddedSeq}`;
};
