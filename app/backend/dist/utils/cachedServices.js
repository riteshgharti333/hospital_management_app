"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachedServices = void 0;
// services/cachedServices.ts
const client_1 = require("@prisma/client");
const modelConfig_1 = require("../config/modelConfig");
const pagination_1 = require("../utils/pagination");
const prisma = new client_1.PrismaClient();
exports.cachedServices = {
    admissions: {
        getAll: () => (0, pagination_1.cursorPaginate)(prisma, {
            model: "admission",
            ...modelConfig_1.MODEL_CONFIG.admission,
        }),
    },
    births: {
        getAll: () => (0, pagination_1.cursorPaginate)(prisma, {
            model: "birth",
            ...modelConfig_1.MODEL_CONFIG.birth,
        }),
    },
    // Add all other models in the same simple format
    patients: {
        getAll: () => (0, pagination_1.cursorPaginate)(prisma, {
            model: "patient",
            ...modelConfig_1.MODEL_CONFIG.patient,
        }),
    },
    // Continue for all your models...
};
