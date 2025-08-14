// services/cachedServices.ts
import { PrismaClient } from "@prisma/client";
import { MODEL_CONFIG, ModelName } from "../config/modelConfig";
import { cursorPaginate } from "../utils/pagination";

const prisma = new PrismaClient();

export const cachedServices = {
  admissions: {
    getAll: () =>
      cursorPaginate(prisma, {
        model: "admission",
        ...MODEL_CONFIG.admission,
      }),
  },
  births: {
    getAll: () =>
      cursorPaginate(prisma, {
        model: "birth",
        ...MODEL_CONFIG.birth,
      }),
  },
  // Add all other models in the same simple format
  patients: {
    getAll: () =>
      cursorPaginate(prisma, {
        model: "patient",
        ...MODEL_CONFIG.patient,
      }),
  },
  // Continue for all your models...
};
