import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const BABY_SEX = ["Male", "Female"];
const DELIVERY_TYPES = ["Normal", "Cesarean", "Forceps", "Vacuum"];
const PLACES = ["Hospital", "Home", "Clinic", "Other"];

async function seedBirths(count = 100) {
  const batchSize = 50;

  const step = 1000 * 2; // 2 seconds gap

  // ✅ Start from past (IMPORTANT)
  let baseTime = Date.now() - count * step;

  console.log(`📋 Starting birth seed`);
  console.time("Birth Seeding");

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      baseTime += step;

      const createdAt = new Date(baseTime);
      const updatedAt = createdAt;

      // ✅ Always in past relative to createdAt
      const birthDate = faker.date.past({
        years: 1,
        refDate: createdAt,
      });

      // ✅ FIX: no mutation
      const startOfDay = new Date(birthDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(birthDate);
      endOfDay.setHours(23, 59, 59, 999);

      const birthTime = faker.date
        .between({ from: startOfDay, to: endOfDay })
        .toTimeString()
        .slice(0, 5);

      const mobileNumber =
        faker.helpers.arrayElement(["9", "8", "7"]) + faker.string.numeric(9);

      batch.push({
        birthTime,
        birthDate,
        babySex: faker.helpers.arrayElement(BABY_SEX),
        babyWeightKg: Number(
          faker.number.float({ min: 2.0, max: 4.5, precision: 0.1 }).toFixed(1),
        ),
        fathersName: faker.person.fullName({ sex: "male" }),
        mothersName: faker.person.fullName({ sex: "female" }),
        mobileNumber,
        deliveryType: faker.helpers.arrayElement(DELIVERY_TYPES),
        placeOfBirth: faker.helpers.arrayElement(PLACES),
        attendantsName: faker.person.fullName(),
        createdAt,
        updatedAt,
      });
    }

    await prisma.birth.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(
      `✅ Inserted ${Math.min(i + batchSize, count)}/${count} birth records`,
    );
  }

  console.timeEnd("Birth Seeding");
}

seedBirths(100)
  .then(async () => {
    console.log("\n🎉 Done seeding births!");

    const sample = await prisma.birth.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        babySex: true,
        birthDate: true,
        createdAt: true,
      },
    });

    console.log("\n📊 Latest 5 births:");
    sample.forEach((b) => {
      console.log(
        `ID: ${b.id} | ${b.babySex} | ${b.birthDate.toISOString()} | ${b.createdAt.toISOString()}`,
      );
    });

    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error seeding births:", err);
    await prisma.$disconnect();
    process.exit(1);
  });


  ////////////////////


  import { PrismaClient } from "@prisma/client";
  import { faker } from "@faker-js/faker";
  
  const prisma = new PrismaClient();
  
  const GENDERS = ["Male", "Female", "Other"];
  
  const LOCALITIES = [
    "Sector 21",
    "Sector 45",
    "DLF Phase 3",
    "Lajpat Nagar",
    "Karol Bagh",
    "Saket",
    "Malviya Nagar",
    "Rajouri Garden",
    "Janakpuri",
    "Pitampura",
  ];
  
  const CITIES = [
    "New Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
  ];
  
  async function seedPatients(count = 100) {
    const batchSize = 50;
    const step = 1000 * 2; // 2 sec gap
  
    // ✅ Start from past
    let baseTime = Date.now() - count * step;
  
    // ✅ Get last sequence
    const year = new Date().getFullYear();
  
    const lastPatient = await prisma.patient.findFirst({
      orderBy: { id: "desc" },
      select: { hospitalPatientId: true },
    });
  
    let seq = lastPatient
      ? Number(lastPatient.hospitalPatientId.split("-")[2])
      : 0;
  
    console.log("📋 Starting patient seed");
    console.time("Patient Seeding");
  
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
  
      for (let j = 0; j < batchSize && i + j < count; j++) {
        baseTime += step;
        seq++;
  
        const createdAt = new Date(baseTime);
        const updatedAt = createdAt;
  
        // ✅ DOB always valid
        const dateOfBirth = faker.date.birthdate({
          min: 1,
          max: 90,
          mode: "age",
        });
  
        // extra safety (never future)
        if (dateOfBirth > createdAt) {
          dateOfBirth.setFullYear(createdAt.getFullYear() - 1);
        }
  
        const mobileNumber =
          faker.helpers.arrayElement(["9", "8", "7"]) +
          faker.string.numeric(9);
  
        const aadhaarNumber = faker.string.numeric(12);
  
        const locality = faker.helpers.arrayElement(LOCALITIES);
        const city = faker.helpers.arrayElement(CITIES);
        const houseNo = faker.number.int({ min: 1, max: 999 });
  
        const address = `House No. ${houseNo}, ${locality}, ${city}`;
  
        batch.push({
          hospitalPatientId: `PAT-${year}-${seq}`, // ✅ FIXED
          fullName: faker.person.fullName(),
          dateOfBirth,
          gender: faker.helpers.arrayElement(GENDERS),
          mobileNumber,
          aadhaarNumber,
          address,
          createdAt,
          updatedAt,
        });
      }
  
      await prisma.patient.createMany({
        data: batch,
        skipDuplicates: true,
      });
  
      console.log(
        `✅ Inserted ${Math.min(i + batchSize, count)}/${count} patients`
      );
    }
  
    console.timeEnd("Patient Seeding");
  }
  
  // 🚀 Run Seeder
  seedPatients(100)
    .then(async () => {
      console.log("\n🎉 Done seeding patients!");
  
      const sample = await prisma.patient.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          hospitalPatientId: true,
          fullName: true,
          createdAt: true,
        },
      });
  
      console.log("\n📊 Latest 5 patients:");
      sample.forEach((p) => {
        console.log(
          `ID: ${p.id} | ${p.hospitalPatientId} | ${p.createdAt.toISOString()}`
        );
      });
  
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error("❌ Error seeding patients:", err);
      await prisma.$disconnect();
      process.exit(1);
    });
    ///////////////////////


    import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const GENDERS = ["Male", "Female", "Other"];

const LOCALITIES = [
  "Sector 21",
  "Sector 45",
  "DLF Phase 3",
  "Lajpat Nagar",
  "Karol Bagh",
  "Saket",
  "Malviya Nagar",
  "Rajouri Garden",
  "Janakpuri",
  "Pitampura",
];

const CITIES = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
];

async function seedPatients(count = 100) {
  const batchSize = 50;
  const step = 1000 * 2; // 2 sec gap

  // ✅ Start from past
  let baseTime = Date.now() - count * step;

  // ✅ Get last sequence
  const year = new Date().getFullYear();

  const lastPatient = await prisma.patient.findFirst({
    orderBy: { id: "desc" },
    select: { hospitalPatientId: true },
  });

  let seq = lastPatient
    ? Number(lastPatient.hospitalPatientId.split("-")[2])
    : 0;

  console.log("📋 Starting patient seed");
  console.time("Patient Seeding");

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      baseTime += step;
      seq++;

      const createdAt = new Date(baseTime);
      const updatedAt = createdAt;

      // ✅ DOB always valid
      const dateOfBirth = faker.date.birthdate({
        min: 1,
        max: 90,
        mode: "age",
      });

      // extra safety (never future)
      if (dateOfBirth > createdAt) {
        dateOfBirth.setFullYear(createdAt.getFullYear() - 1);
      }

      const mobileNumber =
        faker.helpers.arrayElement(["9", "8", "7"]) +
        faker.string.numeric(9);

      const aadhaarNumber = faker.string.numeric(12);

      const locality = faker.helpers.arrayElement(LOCALITIES);
      const city = faker.helpers.arrayElement(CITIES);
      const houseNo = faker.number.int({ min: 1, max: 999 });

      const address = `House No. ${houseNo}, ${locality}, ${city}`;

      batch.push({
        hospitalPatientId: `PAT-${year}-${seq}`, // ✅ FIXED
        fullName: faker.person.fullName(),
        dateOfBirth,
        gender: faker.helpers.arrayElement(GENDERS),
        mobileNumber,
        aadhaarNumber,
        address,
        createdAt,
        updatedAt,
      });
    }

    await prisma.patient.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(
      `✅ Inserted ${Math.min(i + batchSize, count)}/${count} patients`
    );
  }

  console.timeEnd("Patient Seeding");
}

// 🚀 Run Seeder
seedPatients(100)
  .then(async () => {
    console.log("\n🎉 Done seeding patients!");

    const sample = await prisma.patient.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        hospitalPatientId: true,
        fullName: true,
        createdAt: true,
      },
    });

    console.log("\n📊 Latest 5 patients:");
    sample.forEach((p) => {
      console.log(
        `ID: ${p.id} | ${p.hospitalPatientId} | ${p.createdAt.toISOString()}`
      );
    });

    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error seeding patients:", err);
    await prisma.$disconnect();
    process.exit(1);
  });