import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const STATUSES = ["BOOKED", "CANCELLED", "EXPIRED"];

async function seedAppointments(count = 50) {
  const batchSize = 25;

  const step = 1000 * 30; // 30 sec gap
  let baseTime = Date.now() - count * step; // ✅ start in past

  console.log("📋 Starting appointment seed");
  console.time("Appointment Seeding");

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      baseTime += step;

      const createdAt = new Date(baseTime);
      const updatedAt = createdAt;

      // ✅ Appointment date (same day or near past)
      const appointmentDate = faker.date.recent({
        days: 10,
        refDate: createdAt,
      });

      // ✅ Time HH:mm
      const appointmentTime = faker.date
        .between({
          from: new Date(appointmentDate.setHours(9, 0, 0)),
          to: new Date(appointmentDate.setHours(18, 0, 0)),
        })
        .toTimeString()
        .slice(0, 5);

      const doctorId = faker.number.int({ min: 1, max: 30 });

      batch.push({
        appointmentDate,
        appointmentTime,
        doctorId,
        status: faker.helpers.arrayElement(STATUSES),
        createdAt,
        updatedAt,
      });
    }

    await prisma.appointment.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(
      `✅ Inserted ${Math.min(i + batchSize, count)}/${count} appointments`
    );
  }

  console.timeEnd("Appointment Seeding");
}

seedAppointments(50)
  .then(async () => {
    console.log("\n🎉 Done seeding appointments!");

    const sample = await prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    console.log("\n📊 Latest 5 appointments:");
    sample.forEach((a) => {
      console.log(
        `Doctor: ${a.doctorId} | ${a.appointmentDate.toISOString()} | ${a.appointmentTime}`
      );
    });

    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error seeding appointments:", err);
    await prisma.$disconnect();
    process.exit(1);
  });