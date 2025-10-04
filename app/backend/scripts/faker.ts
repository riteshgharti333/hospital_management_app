import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function generateFakeAdmissions(count: number) {
  const batchSize = 1000;

  for (let i = 0; i < count; i += batchSize) {
    const admissionsBatch: Prisma.AdmissionCreateManyInput[] = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      admissionsBatch.push({
        admissionDate: faker.date.past({ years: 1 }),
        admissionTime: faker.date
          .recent({ days: 1 })
          .toTimeString()
          .slice(0, 8),
        dischargeDate: undefined,
        gsRsRegNo: `GSFAKE${i + j}`, // required by Prisma
        wardNo: ((j % 10) + 1).toString(),
        bedNo: faker.string.numeric(2),
        bloodGroup: faker.helpers.arrayElement([
          "A+",
          "B+",
          "AB+",
          "O+",
          "A-",
          "B-",
          "AB-",
          "O-",
        ]),
        aadhaarNo: faker.string.numeric(12),
        urnNo: faker.string.uuid(), // optional, can be skipped
        patientName: faker.person.fullName(),
        patientAge: faker.number.int({ min: 1, max: 100 }),
        patientSex: j % 2 === 0 ? "Male" : "Female",
        guardianType: faker.helpers.arrayElement([
          "Father",
          "Mother",
          "Spouse",
          "Other",
        ]),
        guardianName: faker.person.fullName(),
        phoneNo: faker.phone.number(),
        patientAddress: faker.location.streetAddress(),
        bodyWeightKg: faker.number.float({ min: 40, max: 100 }),
        bodyHeightCm: faker.number.float({ min: 140, max: 200 }),
        literacy: faker.helpers.arrayElement([
          "Illiterate",
          "Primary",
          "Secondary",
          "Graduate",
        ]),
        occupation: faker.person.jobTitle(),
        doctorName: faker.person.fullName(),
        isDelivery: faker.datatype.boolean(),
        createdAt: faker.date.recent({ days: 60 }),
        updatedAt: faker.date.recent({ days: 60 }),
      });
    }

    await prisma.admission.createMany({
      data: admissionsBatch,
    });

    console.log(
      `Inserted ${Math.min(i + batchSize, count)} / ${count} admissions`
    );
  }
}

generateFakeAdmissions(100000)
  .then(async () => {
    console.log("✅ Finished inserting 100k fake admissions!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
