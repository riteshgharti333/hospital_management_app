import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const departments = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "General Medicine",
];

const statuses = ["Active", "Inactive", "On Leave"];

const qualifications = ["MBBS", "MD", "MS", "DM", "MCh"];

const designations = [
  "Junior Doctor",
  "Senior Resident",
  "Consultant",
  "Senior Consultant",
];

const specializations = [
  "Heart Specialist",
  "Brain Specialist",
  "Child Specialist",
  "Bone Specialist",
  "General Physician",
];

async function seedDoctors(count: number = 100) {
  const year = new Date().getFullYear();
  const batchSize = 50;

  // 🔥 Get last sequence ONCE
  const last = await prisma.doctor.findFirst({
    where: {
      registrationNo: {
        startsWith: `DOC-${year}`,
      },
    },
    orderBy: {
      registrationNo: "desc",
    },
    select: {
      registrationNo: true,
    },
  });

  let seq = last
    ? Number(last.registrationNo.split("-")[2])
    : 0;

  // 🔥 Time control (monotonic increasing)
  const baseDate = new Date("2025-01-01").getTime();
  const step = 1000 * 60; // 1 minute gap
  let globalIndex = 0;

  console.time("Doctor Seeding");

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      seq++;

      // ✅ Always increasing timestamp
      const createdAt = new Date(baseDate + globalIndex * step);
      const updatedAt = createdAt;
      globalIndex++;

      batch.push({
        fullName: faker.person.fullName(),
        mobileNumber: faker.string.numeric(10),
        email: faker.internet.email(),

        qualification: faker.helpers.arrayElement(qualifications),
        designation: faker.helpers.arrayElement(designations),
        department: faker.helpers.arrayElement(departments),
        specialization: faker.helpers.arrayElement(specializations),
        status: faker.helpers.arrayElement(statuses),

        registrationNo: `DOC-${year}-${String(seq).padStart(4, "0")}`,

        createdAt,
        updatedAt,
      });
    }

    await prisma.doctor.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(`Inserted ${i + batch.length}/${count}`);
  }

  console.timeEnd("Doctor Seeding");
}

// Run Seeder
seedDoctors(100)
  .then(async () => {
    console.log("✅ Done seeding doctors");
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });    