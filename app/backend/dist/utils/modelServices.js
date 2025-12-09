"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
// services/modelServices.ts
const client_1 = require("@prisma/client");
const modelConfig_1 = require("../config/modelConfig");
const pagination_1 = require("../utils/pagination");
const prisma = new client_1.PrismaClient();
function buildService(model) {
    return {
        getAll: (cursor, limit) => (0, pagination_1.cursorPaginate)(prisma, {
            model,
            cursorField: modelConfig_1.MODEL_CONFIG[model].cursorField,
            limit: limit || modelConfig_1.MODEL_CONFIG[model].defaultLimit,
            cacheExpiry: modelConfig_1.MODEL_CONFIG[model].cacheExpiry
        })
    };
}
// Pre-built services for all models
exports.services = {
    admissions: buildService('admission'),
    //   births: buildService('birth'),
    //   patients: buildService('patient'),
    //   doctors: buildService('doctor'),
    // Add all other models...
};
