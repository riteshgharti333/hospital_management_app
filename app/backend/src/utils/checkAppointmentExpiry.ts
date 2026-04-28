// utils/checkAppointmentExpiry.ts
import { prisma } from "../lib/prisma";
import { bumpCacheVersion } from "./cacheVersion";

export const checkAndUpdateExpiredAppointments = async () => {
  const now = new Date();
  
  // Get current date and time in Nepal time (UTC+5:45)
  // Or use your local timezone
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  
  // Update all expired appointments
  const result = await prisma.appointment.updateMany({
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
    await bumpCacheVersion("appointment");
  }
  
  return result;
};

// Simple function to check if a single appointment is expired
export const isAppointmentExpired = (appointmentDate: Date, appointmentTime: string) => {
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