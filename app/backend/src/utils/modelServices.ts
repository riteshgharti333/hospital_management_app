// services/modelServices.ts
import { PrismaClient } from "@prisma/client";
import { MODEL_CONFIG } from "../config/modelConfig";
import { cursorPaginate } from "../utils/pagination";

const prisma = new PrismaClient();

function buildService(model: keyof typeof MODEL_CONFIG) {
  return {
    getAll: (cursor?: string | number, limit?: number) => 
      cursorPaginate(prisma, {
        model,
        cursorField: MODEL_CONFIG[model].cursorField,
        limit: limit || MODEL_CONFIG[model].defaultLimit,
        cacheExpiry: MODEL_CONFIG[model].cacheExpiry
      })
  };
}

// Pre-built services for all models
export const services = {
  admissions: buildService('admission'),
//   births: buildService('birth'),
//   patients: buildService('patient'),
//   doctors: buildService('doctor'),
  // Add all other models...
};