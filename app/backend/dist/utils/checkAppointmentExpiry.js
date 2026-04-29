"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppointmentExpired = exports.checkAndUpdateExpiredAppointments = void 0;
// utils/checkAppointmentExpiry.ts
const prisma_1 = require("../lib/prisma");
const cacheVersion_1 = require("./cacheVersion");
const checkAndUpdateExpiredAppointments = async () => {
    const now = new Date();
    // Get current date and time in Nepal time (UTC+5:45)
    // Or use your local timezone
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    // Update all expired appointments
    const result = await prisma_1.prisma.appointment.updateMany({
        where: {
            status: "BOOKED",
            OR: [
                {
                    // Date is in past
                    appointmentDate: {
                        lt: new Date(currentDate),
                    },
                },
                {
                    // Same date but time passed
                    appointmentDate: new Date(currentDate),
                    appointmentTime: {
                        lt: currentTime,
                    },
                },
            ],
        },
        data: {
            status: "EXPIRED",
        },
    });
    if (result.count > 0) {
        await (0, cacheVersion_1.bumpCacheVersion)("appointment");
    }
    return result;
};
exports.checkAndUpdateExpiredAppointments = checkAndUpdateExpiredAppointments;
// Simple function to check if a single appointment is expired
const isAppointmentExpired = (appointmentDate, appointmentTime) => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    const appointmentDateStr = appointmentDate.toISOString().split('T')[0];
    if (appointmentDateStr < currentDate) {
        return true;
    }
    if (appointmentDateStr === currentDate && appointmentTime < currentTime) {
        return true;
    }
    return false;
};
exports.isAppointmentExpired = isAppointmentExpired;
