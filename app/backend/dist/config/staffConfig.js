"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STAFF_CONFIG = void 0;
const prisma_1 = require("../lib/prisma");
exports.STAFF_CONFIG = {
    DOCTOR: {
        prefix: "DOC-",
        table: prisma_1.prisma.doctor,
        regField: "registrationNo",
        role: "DOCTOR",
        nameField: "fullName",
        emailField: "email",
    },
    NURSE: {
        prefix: "NUR-",
        table: prisma_1.prisma.nurse,
        regField: "registrationNo",
        role: "NURSE",
        nameField: "fullName",
        emailField: "email",
    }
};
