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

  // ✅ Get last registration sequence
  const lastDoctor = await prisma.doctor.findFirst({
    orderBy: { id: "desc" },
    select: {
      registrationNo: true,
      createdAt: true,
    },
  });

  let seq = lastDoctor
    ? Number(lastDoctor.registrationNo.split("-")[2])
    : 0;

  // ✅ IMPORTANT: start from latest createdAt
  let baseTime = lastDoctor
    ? new Date(lastDoctor.createdAt).getTime()
    : Date.now();

  const step = 1000 * 60; // 1 minute gap

  console.time("Doctor Seeding");

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      seq++;

      baseTime += step; // ✅ always move forward

      const createdAt = new Date(baseTime);
      const updatedAt = createdAt;

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


  ///////////////////////////////




  import { PrismaClient } from "@prisma/client";
  import { faker } from "@faker-js/faker";
  
  const prisma = new PrismaClient();
  
  const GENDERS = ["Male", "Female", "Other"];
  
  // Indian city/area suffixes for realistic addresses
  const LOCALITIES = [
    "Sector 21", "Sector 45", "Sector 62", "DLF Phase 1", "DLF Phase 3",
    "Vasant Kunj", "Dwarka Sector 7", "Rohini Sector 11", "Lajpat Nagar",
    "Karol Bagh", "Connaught Place", "Saket", "Malviya Nagar", "Hauz Khas",
    "Mayur Vihar Phase 1", "Patel Nagar", "Rajouri Garden", "Janakpuri",
    "Uttam Nagar", "Paschim Vihar", "Pitampura", "Shalimar Bagh",
  ];
  
  const CITIES = [
    "New Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata",
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  ];
  
  async function seedPatients(count: number = 100) {
    const year = new Date().getFullYear();
    const batchSize = 50;
  
    // ✅ Get last patient for sequence and time
    const lastPatient = await prisma.patient.findFirst({
      orderBy: { id: "desc" },
      select: {
        hospitalPatientId: true,
        createdAt: true,
      },
    });
  
    let seq = lastPatient
      ? Number(lastPatient.hospitalPatientId.split("-")[2])
      : 0;
  
    // ✅ Start from latest createdAt (ensures forward time)
    let baseTime = lastPatient
      ? new Date(lastPatient.createdAt).getTime()
      : Date.now();
  
    const step = 1000 * 60 * 30; // 30 minute gap between patients
  
    console.log(`📋 Starting patient seed - Sequence starts at: ${seq + 1}`);
    console.time("Patient Seeding");
  
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
  
      for (let j = 0; j < batchSize && i + j < count; j++) {
        seq++;
        baseTime += step;
  
        const createdAt = new Date(baseTime);
        const updatedAt = createdAt;
  
        // Generate realistic Indian mobile number
        const mobileNumber = faker.helpers.arrayElement(["9", "8", "7"]) 
          + faker.string.numeric(9);
  
        // Generate realistic Aadhaar (12 digits)
        const aadhaarNumber = faker.string.numeric(12);
  
        // Generate realistic address
        const locality = faker.helpers.arrayElement(LOCALITIES);
        const city = faker.helpers.arrayElement(CITIES);
        const houseNo = faker.number.int({ min: 1, max: 999 });
        const address = `House No. ${houseNo}, ${locality}, ${city}`;
  
        // Random date of birth (age between 1 and 90 years)
        const minAge = 1;
        const maxAge = 90;
        const yearsAgo = faker.number.int({ min: minAge, max: maxAge });
        const dateOfBirth = faker.date.birthdate({ 
          min: yearsAgo, 
          max: yearsAgo, 
          mode: "age" 
        });
  
        batch.push({
          fullName: faker.person.fullName(),
          dateOfBirth,
          gender: faker.helpers.arrayElement(GENDERS),
          mobileNumber,
          aadhaarNumber,
          address,
          hospitalPatientId: `PAT-${year}-${String(seq).padStart(5, "0")}`,
          createdAt,
          updatedAt,
        });
      }
  
      await prisma.patient.createMany({
        data: batch,
        skipDuplicates: true,
      });
  
      console.log(`✅ Inserted ${Math.min(i + batchSize, count)}/${count} patients`);
    }
  
    console.timeEnd("Patient Seeding");
  }
  
  // Run Seeder
  seedPatients(100)
    .then(async () => {
      console.log("\n🎉 Done seeding patients!");
      
      // Show sample of inserted data
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
      
      console.log("\n📊 Latest 5 patients (verify order):");
      sample.forEach((p) => {
        console.log(`  ID: ${p.id} | ${p.hospitalPatientId} | ${p.createdAt.toISOString()}`);
      });
      
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error("❌ Error seeding patients:", err);
      await prisma.$disconnect();
      process.exit(1);
    });

    ///////////////////////////////////


import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedAdmissions(count: number = 50) {
  const year = new Date().getFullYear();
  const batchSize = 25;

  const existingPatients = await prisma.patient.findMany({
    where: { id: { lte: 50 } },
    select: { id: true },
  });

  const existingDoctors = await prisma.doctor.findMany({
    where: { id: { lte: 50 } },
    select: { id: true },
  });

  if (existingPatients.length === 0 || existingDoctors.length === 0) {
    console.error("❌ No patients or doctors found with ID <= 50");
    console.error(`Patients found: ${existingPatients.length}`);
    console.error(`Doctors found: ${existingDoctors.length}`);
    process.exit(1);
  }

  const patientIds = existingPatients.map(p => p.id);
  const doctorIds = existingDoctors.map(d => d.id);

  console.log(`📊 Using ${patientIds.length} patients and ${doctorIds.length} doctors`);

  const lastAdmission = await prisma.admission.findFirst({
    orderBy: { id: "desc" },
    select: {
      hospitalAdmissionId: true,
      createdAt: true,
    },
  });

  let seq = lastAdmission
    ? Number(lastAdmission.hospitalAdmissionId.split("-")[2])
    : 0;

  let baseTime = lastAdmission
    ? new Date(lastAdmission.createdAt).getTime()
    : Date.now();

  const step = 1000 * 60 * 45;

  console.log(`📋 Starting admission seed - Sequence starts at: ${seq + 1}`);
  console.time("Admission Seeding");

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      seq++;
      baseTime += step;

      const createdAt = new Date(baseTime);
      const admissionDate = new Date(baseTime - 1000 * 60 * 60 * 2);

      const isDischarged = faker.datatype.boolean();
      let dischargeDate = null;
      
      if (isDischarged) {
        dischargeDate = new Date(admissionDate.getTime() + 1000 * 60 * 60 * 24 * faker.number.int({ min: 1, max: 7 }));
      }

      batch.push({
        hospitalAdmissionId: `ADM-${year}-${String(seq).padStart(6, "0")}`,
        patientId: faker.helpers.arrayElement(patientIds),
        doctorId: faker.helpers.arrayElement(doctorIds),
        admissionDate,
        dischargeDate,
        createdAt,
        updatedAt: createdAt,
      });
    }

    await prisma.admission.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(`✅ Inserted ${Math.min(i + batchSize, count)}/${count} admissions`);
  }

  console.timeEnd("Admission Seeding");
}

seedAdmissions(50)
  .then(async () => {
    console.log("\n🎉 Done seeding admissions!");

    const sample = await prisma.admission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        hospitalAdmissionId: true,
        admissionDate: true,
        dischargeDate: true,
        createdAt: true,
        patient: {
          select: {
            id: true,
            fullName: true,
            gender: true,
            mobileNumber: true,
            aadhaarNumber: true,
          },
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    console.log("\n📊 Latest 5 admissions (verify order):");
    sample.forEach((a) => {
      console.log(`  ID: ${a.id} | ${a.hospitalAdmissionId}`);
      console.log(`     Patient: ${a.patient.id} - ${a.patient.fullName}`);
      console.log(`     Doctor: ${a.doctor.id} - ${a.doctor.fullName}`);
      console.log(`     Created: ${a.createdAt.toISOString()}`);
    });

    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error seeding admissions:", err);
    await prisma.$disconnect();
    process.exit(1);
  });




