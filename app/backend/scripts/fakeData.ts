// // import { PrismaClient, Prisma } from "@prisma/client";
// // import { faker } from "@faker-js/faker";

// // const prisma = new PrismaClient();

// // async function generateFakeAdmissions(count: number) {
// //   const batchSize = 1000;

// //   for (let i = 0; i < count; i += batchSize) {
// //     const admissionsBatch: Prisma.AdmissionCreateManyInput[] = [];

// //     for (let j = 0; j < batchSize && i + j < count; j++) {
// //       admissionsBatch.push({
// //         admissionDate: faker.date.past({ years: 1 }),
// //         admissionTime: faker.date
// //           .recent({ days: 1 })
// //           .toTimeString()
// //           .slice(0, 8),
// //         dischargeDate: undefined,
// //         gsRsRegNo: `GSFAKE${i + j}`, // required by Prisma
// //         wardNo: ((j % 10) + 1).toString(),
// //         bedNo: faker.string.numeric(2),
// //         bloodGroup: faker.helpers.arrayElement([
// //           "A+",
// //           "B+",
// //           "AB+",
// //           "O+",
// //           "A-",
// //           "B-",
// //           "AB-",
// //           "O-",
// //         ]),
// //         aadhaarNo: faker.string.numeric(12),
// //         urnNo: faker.string.uuid(), // optional, can be skipped
// //         patientName: faker.person.fullName(),
// //         patientAge: faker.number.int({ min: 1, max: 100 }),
// //         patientSex: j % 2 === 0 ? "Male" : "Female",
// //         guardianType: faker.helpers.arrayElement([
// //           "Father",
// //           "Mother",
// //           "Spouse",
// //           "Other",
// //         ]),
// //         guardianName: faker.person.fullName(),
// //         phoneNo: faker.phone.number(),
// //         patientAddress: faker.location.streetAddress(),
// //         bodyWeightKg: faker.number.float({ min: 40, max: 100 }),
// //         bodyHeightCm: faker.number.float({ min: 140, max: 200 }),
// //         literacy: faker.helpers.arrayElement([
// //           "Illiterate",
// //           "Primary",
// //           "Secondary",
// //           "Graduate",
// //         ]),
// //         occupation: faker.person.jobTitle(),
// //         doctorName: faker.person.fullName(),
// //         isDelivery: faker.datatype.boolean(),
// //         createdAt: faker.date.recent({ days: 60 }),
// //         updatedAt: faker.date.recent({ days: 60 }),
// //       });
// //     }

// //     await prisma.admission.createMany({
// //       data: admissionsBatch,
// //     });

// //     console.log(
// //       `Inserted ${Math.min(i + batchSize, count)} / ${count} admissions`
// //     );
// //   }
// // }

// // generateFakeAdmissions(100000)
// //   .then(async () => {
// //     console.log("✅ Finished inserting 100k fake admissions!");
// //     await prisma.$disconnect();
// //   })
// //   .catch(async (e) => {
// //     console.error(e);
// //     await prisma.$disconnect();
// //     process.exit(1);
// //   });


// ///////////////////




// import { PrismaClient, Prisma } from "@prisma/client";
// import { faker } from "@faker-js/faker";

// const prisma = new PrismaClient();

// async function generateFakeBirths(count: number) {
//   const batchSize = 1000;

//   console.log("🧹 Clearing existing Birth records...");
//   await prisma.birth.deleteMany();

//   console.log("🚀 Starting fake birth data generation...");

//   for (let i = 0; i < count; i += batchSize) {
//     const birthsBatch: Prisma.BirthCreateManyInput[] = [];

//     for (let j = 0; j < batchSize && i + j < count; j++) {
//       birthsBatch.push({
//         birthTime: faker.date.recent({ days: 30 }).toTimeString().slice(0, 8),
//         birthDate: faker.date.past({ years: 1 }),
//         babySex: faker.helpers.arrayElement(["Male", "Female"]),
//         babyWeightKg: faker.number.float({
//           min: 2.0,
//           max: 4.5,
//           multipleOf: 0.01,
//         }),
//         fathersName: faker.person.fullName(),
//         mothersName: faker.person.fullName(),
//         mobileNumber: `${faker.number.int({ min: 6, max: 9 })}${faker.string.numeric(9)}`,
//         deliveryType: faker.helpers.arrayElement([
//           "Normal",
//           "Cesarean",
//           "Assisted",
//         ]),
//         placeOfBirth: faker.helpers.arrayElement([
//           "General Ward",
//           "Private Room",
//           "Delivery Suite",
//           "Maternity Center",
//         ]),
//         attendantsName: faker.person.fullName(),
//         createdAt: faker.date.recent({ days: 60 }),
//         updatedAt: faker.date.recent({ days: 60 }),
//       });
//     }

//     await prisma.birth.createMany({ data: birthsBatch });

//     console.log(`✅ Inserted ${Math.min(i + batchSize, count)} / ${count} records`);
//   }

//   console.log("🎉 Finished inserting all fake birth records!");
// }

// generateFakeBirths(10_000)
//   .then(async () => {
//     console.log("✅ All done! Disconnecting Prisma...");
//     await prisma.$disconnect();
//   })
//   .catch(async (error) => {
//     console.error("❌ Error generating fake data:", error);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
// // 



// import { PrismaClient, Prisma } from "@prisma/client";
// import { faker } from "@faker-js/faker";

// const prisma = new PrismaClient();

// async function generateFakeDepartments(count: number) {
//   const batchSize = 500;

//   console.log("🧹 Clearing existing Department records...");
//   await prisma.department.deleteMany();

//   console.log("🚀 Starting fake department data generation...");

//   const startTime = Date.now();

//   for (let i = 0; i < count; i += batchSize) {
//     const batch: Prisma.DepartmentCreateManyInput[] = [];

//     for (let j = 0; j < batchSize && i + j < count; j++) {
//       const name = `${faker.commerce.department()} Department ${i + j + 1}`;

//       batch.push({
//         name,
//         head: faker.person.fullName(),
//         contactNumber: faker.number.int({ min: 1000000000, max: 9999999999 }).toString(),
//         email: faker.internet.email({
//           firstName: faker.person.firstName(),
//           lastName: faker.person.lastName(),
//           provider: "example.com",
//         }),
//         location: faker.location.city(),
//         description: faker.lorem.sentence(),
//         status: faker.helpers.arrayElement(["Active", "Inactive"]),
//         createdAt: faker.date.recent({ days: 60 }),
//         updatedAt: faker.date.recent({ days: 60 }),
//       });
//     }

//     await prisma.department.createMany({ data: batch });
//     console.log(`✅ Inserted ${Math.min(i + batchSize, count)} / ${count} departments`);
//   }

//   const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
//   console.log(`🎉 Finished inserting ${count} fake departments in ${totalSeconds}s`);
// }

// generateFakeDepartments(1_000)
//   .then(async () => {
//     console.log("✅ All done! Disconnecting Prisma...");
//     await prisma.$disconnect();
//   })
//   .catch(async (error) => {
//     console.error("❌ Error generating fake data:", error);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


// import { PrismaClient, Prisma } from "@prisma/client";
// import { faker } from "@faker-js/faker";

// const prisma = new PrismaClient();

// async function generateFakeBeds(count: number) {
//   const batchSize = 500;

//   console.log("🧹 Clearing existing Bed records...");
//   await prisma.bed.deleteMany();

//   console.log("🚀 Starting fake bed data generation...");
//   const startTime = Date.now();

//   for (let i = 0; i < count; i += batchSize) {
//     const bedsBatch: Prisma.BedCreateManyInput[] = [];

//     for (let j = 0; j < batchSize && i + j < count; j++) {
//       bedsBatch.push({
//         bedNumber: `BED-${(i + j + 1).toString().padStart(4, "0")}`, // e.g., BED-0001
//         wardNumber: `WARD-${faker.number.int({ min: 1, max: 20 })}`,
//         status: faker.helpers.arrayElement(["Available", "Occupied", "Maintenance"]),
//         description: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }),
//         createdAt: faker.date.recent({ days: 60 }),
//         updatedAt: faker.date.recent({ days: 60 }),
//       });
//     }

//     await prisma.bed.createMany({ data: bedsBatch });
//     console.log(`✅ Inserted ${Math.min(i + batchSize, count)} / ${count} beds`);
//   }

//   const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
//   console.log(`🎉 Finished inserting ${count} fake beds in ${totalSeconds}s`);
// }

// generateFakeBeds(1_000)
//   .then(async () => {
//     console.log("✅ All done! Disconnecting Prisma...");
//     await prisma.$disconnect();
//   })
//   .catch(async (error) => {
//     console.error("❌ Error generating fake data:", error);
//     await prisma.$disconnect();
//     process.exit(1);
//   });



// import { PrismaClient, Prisma } from "@prisma/client";
// import { faker } from "@faker-js/faker";

// const prisma = new PrismaClient();

// async function generateFakeBedAssignments(count: number) {
//   const batchSize = 500;

//   console.log("🧹 Clearing existing BedAssignment records...");
//   await prisma.bedAssignment.deleteMany();

//   console.log("🚀 Starting fake bed assignment data generation...");
//   const startTime = Date.now();

//   for (let i = 0; i < count; i += batchSize) {
//     const batch: Prisma.BedAssignmentCreateManyInput[] = [];

//     for (let j = 0; j < batchSize && i + j < count; j++) {
//       const allocateDate = faker.date.past({ years: 1 });
//       const status = faker.helpers.arrayElement([
//         "Active",
//         "Discharged",
//         "Transferred",
//       ]);

//       let dischargeDate: Date | undefined = undefined;

//       // If discharged or transferred, assign a realistic discharge date after allocation
//       if (status !== "Active") {
//         dischargeDate = faker.date.between({
//           from: allocateDate,
//           to: new Date(),
//         });
//       }

//       batch.push({
//         wardNumber: `WARD-${faker.number.int({ min: 1, max: 20 })}`,
//         bedNumber: `BED-${faker.number.int({ min: 1, max: 1000 }).toString().padStart(4, "0")}`,
//         bedType: faker.helpers.arrayElement([
//           "General",
//           "Semi-Private",
//           "Private",
//           "ICU",
//           "NICU",
//           "Maternity",
//         ]),
//         patientName: faker.person.fullName(),
//         allocateDate,
//         dischargeDate,
//         status,
//         notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.5 }),
//         createdAt: faker.date.recent({ days: 60 }),
//         updatedAt: faker.date.recent({ days: 60 }),
//       });
//     }

//     await prisma.bedAssignment.createMany({ data: batch });
//     console.log(`✅ Inserted ${Math.min(i + batchSize, count)} / ${count} bed assignments`);
//   }

//   const totalSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
//   console.log(`🎉 Finished inserting ${count} fake bed assignments in ${totalSeconds}s`);
// }

// generateFakeBedAssignments(1_000)
//   .then(async () => {
//     console.log("✅ All done! Disconnecting Prisma...");
//     await prisma.$disconnect();
//   })
//   .catch(async (error) => {
//     console.error("❌ Error generating fake data:", error);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


import { PrismaClient } from "@prisma/client";
// import { faker } from "@faker-js/faker";

// const prisma = new PrismaClient();

// const SHIFTS = ["Day", "Night", "Rotating"];
// const STATUSES = ["Active", "Inactive", "On Leave"];

// async function generateFakeNurses(count = 1000) {
//   console.log(`🚀 Generating ${count} fake nurses...`);

//   const nurses = Array.from({ length: count }).map(() => ({
//     fullName: faker.person.fullName(),
//     mobileNumber: `${faker.number.int({ min: 6, max: 9 })}${faker.string.numeric(9)}`,
//     registrationNo: `REG-${faker.string.alphanumeric(6).toUpperCase()}`,
//     department: faker.helpers.arrayElement([
//       "Cardiology",
//       "Neurology",
//       "Pediatrics",
//       "Oncology",
//       "Orthopedics",
//       "Emergency",
//       "ICU",
//     ]),
//     address: faker.location.streetAddress(),
//     shift: faker.helpers.arrayElement(SHIFTS),
//     status: faker.helpers.arrayElement(STATUSES),
//   }));

//   // Insert in chunks of 100 to prevent overload
//   for (let i = 0; i < nurses.length; i += 100) {
//     const chunk = nurses.slice(i, i + 100);
//     await prisma.nurse.createMany({ data: chunk });
//     console.log(`✅ Inserted ${i + chunk.length}/${count}`);
//   }

//   console.log("🎉 Done generating nurse data!");
//   await prisma.$disconnect();
// }

// generateFakeNurses().catch((err) => {
//   console.error("❌ Error generating fake nurses:", err);
//   prisma.$disconnect();
// });
