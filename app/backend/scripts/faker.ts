import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const genders = ["Male", "Female", "Other"];

const START_DATE = new Date("2025-04-01");
const END_DATE = new Date("2026-04-01");

const generateDOB = () =>
  faker.date.birthdate({ min: 1, max: 90, mode: "age" });

const generateMobile = () => faker.string.numeric(10);
const generateAadhaar = () => faker.string.numeric(12);

async function seedPatients(count: number) {
  const year = new Date().getFullYear();
  const batchSize = 1000;

  // 🔥 Get last sequence ONCE
  const last = await prisma.patient.findFirst({
    where: {
      hospitalPatientId: {
        startsWith: `PAT-${year}`,
      },
    },
    orderBy: {
      hospitalPatientId: "desc",
    },
    select: {
      hospitalPatientId: true,
    },
  });

  let seq = last
    ? Number(last.hospitalPatientId.split("-")[2])
    : 0;

  console.time("Seeding");

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      seq++;

      const createdAt = faker.date.between({
        from: START_DATE,
        to: END_DATE,
      });

      const updatedAt = faker.date.between({
        from: createdAt,
        to: END_DATE,
      });

      batch.push({
        fullName: faker.person.fullName(),
        dateOfBirth: generateDOB(),
        gender: faker.helpers.arrayElement(genders),
        mobileNumber: generateMobile(),
        aadhaarNumber: generateAadhaar(),
        address: faker.location.streetAddress(),
        hospitalPatientId: `PAT-${year}-${String(seq).padStart(6, "0")}`,
        createdAt,
        updatedAt,
      });
    }

    await prisma.patient.createMany({
      data: batch,
      skipDuplicates: true, // safety
    });

    console.log(`Inserted ${i + batch.length}/${count}`);
  }

  console.timeEnd("Seeding");
}

// 🔥 CHANGE THIS TO 1_000_000
seedPatients(1_000_000)
  .then(async () => {
    console.log("✅ Done seeding 1M patients");
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });