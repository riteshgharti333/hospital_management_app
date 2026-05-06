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


  //////////////////////////





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



  ///////////////////




  import { PrismaClient } from "@prisma/client";
  import { faker } from "@faker-js/faker";
  
  const prisma = new PrismaClient();
  
  const DEPARTMENTS = [
    "General",
    "ICU",
    "Pediatrics",
    "Emergency",
    "Surgery",
  ];
  
  const SHIFTS = ["Day", "Night", "Rotating"];
  
  const STATUSES = ["Active", "Inactive", "On Leave"];
  
  const LOCALITIES = [
    "Sector 21",
    "Sector 45",
    "DLF Phase 3",
    "Lajpat Nagar",
    "Karol Bagh",
    "Saket",
    "Rajouri Garden",
    "Janakpuri",
  ];
  
  const CITIES = [
    "New Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
  ];
  
  async function seedNurses(count = 100) {
    const batchSize = 50;
    const step = 1000 * 2; // 2 second gap
  
    // ✅ Start from past
    let baseTime = Date.now() - count * step;
  
    // ✅ Registration number sequence
    const year = new Date().getFullYear();
  
    const lastNurse = await prisma.nurse.findFirst({
      orderBy: { id: "desc" },
      select: { registrationNo: true },
    });
  
    let seq = lastNurse
      ? Number(lastNurse.registrationNo.split("-")[2])
      : 0;
  
    console.log("📋 Starting nurse seed");
    console.time("Nurse Seeding");
  
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
  
      for (let j = 0; j < batchSize && i + j < count; j++) {
        baseTime += step;
        seq++;
  
        const createdAt = new Date(baseTime);
        const updatedAt = createdAt;
  
        const mobileNumber =
          faker.helpers.arrayElement(["9", "8", "7"]) +
          faker.string.numeric(9);
  
        const locality = faker.helpers.arrayElement(LOCALITIES);
        const city = faker.helpers.arrayElement(CITIES);
        const houseNo = faker.number.int({ min: 1, max: 999 });
  
        const address = `House No. ${houseNo}, ${locality}, ${city}`;
  
        batch.push({
          registrationNo: `NUR-${year}-${seq}`,
  
          fullName: faker.person.fullName(),
  
          mobileNumber,
  
          department: faker.helpers.arrayElement(DEPARTMENTS),
  
          address,
  
          email: faker.internet.email({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
          }),
  
          shift: faker.helpers.arrayElement(SHIFTS),
  
          status: faker.helpers.arrayElement(STATUSES),
  
          createdAt,
          updatedAt,
        });
      }
  
      await prisma.nurse.createMany({
        data: batch,
        skipDuplicates: true,
      });
  
      console.log(
        `✅ Inserted ${Math.min(i + batchSize, count)}/${count} nurses`
      );
    }
  
    console.timeEnd("Nurse Seeding");
  }
  
  // 🚀 Run Seeder
  seedNurses(100)
    .then(async () => {
      console.log("\n🎉 Done seeding nurses!");
  
      const sample = await prisma.nurse.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          registrationNo: true,
          fullName: true,
          department: true,
          shift: true,
          status: true,
          createdAt: true,
        },
      });
  
      console.log("\n📊 Latest 5 nurses:");
  
      sample.forEach((nurse) => {
        console.log(
          `ID: ${nurse.id} | ${nurse.registrationNo} | ${nurse.fullName} | ${nurse.department} | ${nurse.createdAt.toISOString()}`
        );
      });
  
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error("❌ Error seeding nurses:", err);
      await prisma.$disconnect();
      process.exit(1);
    });

    ///////////////


    import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const ENTITY_TYPES = ["PATIENT", "DOCTOR", "BANK", "CASH"];

const AMOUNT_TYPES = ["CREDIT", "DEBIT"];

const PAYMENT_MODES = [
  "CASH",
  "CARD",
  "UPI",
  "BANK_TRANSFER",
  "CHEQUE",
];

const REFERENCE_TYPES = [
  "OPD",
  "IPD",
  "PHARMACY",
  "LAB",
  "PROCEDURE",
  "SALARY",
  "EXPENSE",
  "ADVANCE",
  "REFUND",
  "OTHER",
];

async function seedLedger(count = 300) {
  const batchSize = 50;
  const step = 1000 * 2; // 2 sec gap

  // ✅ Start from past
  let baseTime = Date.now() - count * step;

  // ✅ Get last ledger sequence
  const lastLedger = await prisma.ledger.findFirst({
    orderBy: { id: "desc" },
    select: { code: true },
  });

  let seq = lastLedger
    ? Number(lastLedger.code.split("-")[2])
    : 0;

  console.log("📋 Starting ledger seed");
  console.time("Ledger Seeding");

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      baseTime += step;
      seq++;

      const createdAt = new Date(baseTime);
      const updatedAt = createdAt;

      const entityType = faker.helpers.arrayElement(ENTITY_TYPES);

      // ✅ Repeating IDs based on entity type
      let entityId = "1";

      if (entityType === "PATIENT") {
        entityId = String(faker.number.int({ min: 1, max: 10 }));
      }

      if (entityType === "DOCTOR") {
        entityId = String(faker.number.int({ min: 1, max: 10 }));
      }

      if (entityType === "BANK") {
        entityId = String(faker.number.int({ min: 1, max: 2 }));
      }

      if (entityType === "CASH") {
        entityId = String(faker.number.int({ min: 1, max: 2 }));
      }

      const amountType = faker.helpers.arrayElement(AMOUNT_TYPES);

      const amount = Number(
        faker.finance.amount({
          min: 100,
          max: 50000,
          dec: 2,
        })
      );

      // ✅ Random balance
      const balance = Number(
        faker.finance.amount({
          min: 1000,
          max: 100000,
          dec: 2,
        })
      );

      const referenceType =
        faker.helpers.arrayElement(REFERENCE_TYPES);

      batch.push({
        // ✅ Ledger code
        code: `HMS-LED-${seq}`,

        entityType,

        entityId,

        transactionDate: createdAt,

        description: faker.finance.transactionDescription(),

        amountType,

        amount,

        balance,

        paymentMode: faker.helpers.arrayElement(PAYMENT_MODES),

        referenceType,

        referenceId: `REF-${faker.string.numeric(5)}`,

        remarks: faker.lorem.sentence(),

        createdAt,
        updatedAt,
      });
    }

    await prisma.ledger.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(
      `✅ Inserted ${Math.min(i + batchSize, count)}/${count} ledger entries`
    );
  }

  console.timeEnd("Ledger Seeding");
}

// 🚀 Run Seeder
seedLedger(100)
  .then(async () => {
    console.log("\n🎉 Done seeding ledger!");

    const sample = await prisma.ledger.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },

      select: {
        id: true,
        code: true,
        entityType: true,
        entityId: true,
        amountType: true,
        amount: true,
        balance: true,
        paymentMode: true,
        transactionDate: true,
      },
    });

    console.log("\n📊 Latest 5 ledger entries:");

    sample.forEach((entry) => {
      console.log(
        `ID: ${entry.id} | ${entry.code} | ${entry.entityType}-${entry.entityId} | ${entry.amountType} | ₹${entry.amount} | Balance: ₹${entry.balance}`
      );
    });

    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error seeding ledger:", err);
    await prisma.$disconnect();
    process.exit(1);
  });

  ////////////////



  import { PrismaClient } from "@prisma/client";
  import { faker } from "@faker-js/faker";
  
  const prisma = new PrismaClient();
  
  const ADMISSION_STATUSES = [
    "ACTIVE",
    "DISCHARGED",
    "CANCELLED",
  ];
  
  async function seedAdmissions(count = 500) {
    const batchSize = 50;
    const step = 1000 * 2; // 2 sec gap
  
    // ✅ Start from past
    let baseTime = Date.now() - count * step;
  
    // ✅ Admission sequence
    const year = new Date().getFullYear();
  
    const lastAdmission = await prisma.admission.findFirst({
      orderBy: { id: "desc" },
      select: { hospitalAdmissionId: true },
    });
  
    let seq = lastAdmission
      ? Number(lastAdmission.hospitalAdmissionId.split("-")[2])
      : 0;
  
    console.log("📋 Starting admission seed");
    console.time("Admission Seeding");
  
    for (let i = 0; i < count; i += batchSize) {
      const batch = [];
  
      for (let j = 0; j < batchSize && i + j < count; j++) {
        baseTime += step;
        seq++;
  
        const createdAt = new Date(baseTime);
        const updatedAt = createdAt;
  
        // ✅ Same as createdAt
        const admissionDate = createdAt;
  
        const status =
          faker.helpers.arrayElement(ADMISSION_STATUSES);
  
        // ✅ Discharge only for discharged patients
        let dischargeDate = null;
  
        if (status === "DISCHARGED") {
          dischargeDate = new Date(
            admissionDate.getTime() +
              faker.number.int({ min: 1, max: 7 }) *
                24 *
                60 *
                60 *
                1000
          );
        }
  
        batch.push({
          // ✅ Admission code
          hospitalAdmissionId: `ADM-${year}-${seq}`,
  
          // ✅ Repeating patient IDs
          patientId: faker.number.int({
            min: 1,
            max: 30,
          }),
  
          // ✅ Repeating doctor IDs
          doctorId: faker.number.int({
            min: 1,
            max: 30,
          }),
  
          status,
  
          admissionDate,
  
          dischargeDate,
  
          createdAt,
          updatedAt,
        });
      }
  
      await prisma.admission.createMany({
        data: batch,
        skipDuplicates: true,
      });
  
      console.log(
        `✅ Inserted ${Math.min(i + batchSize, count)}/${count} admissions`
      );
    }
  
    console.timeEnd("Admission Seeding");
  }
  
  // 🚀 Run Seeder
  seedAdmissions(100)
    .then(async () => {
      console.log("\n🎉 Done seeding admissions!");
  
      const sample = await prisma.admission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
  
        select: {
          id: true,
          hospitalAdmissionId: true,
          patientId: true,
          doctorId: true,
          status: true,
          admissionDate: true,
          dischargeDate: true,
          createdAt: true,
        },
      });
  
      console.log("\n📊 Latest 5 admissions:");
  
      sample.forEach((admission) => {
        console.log(
          `ID: ${admission.id} | ${admission.hospitalAdmissionId} | Patient: ${admission.patientId} | Doctor: ${admission.doctorId} | ${admission.status}`
        );
      });
  
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error("❌ Error seeding admissions:", err);
      await prisma.$disconnect();
      process.exit(1);
    });

    ///////////

    import { PrismaClient } from "@prisma/client";
    import { faker } from "@faker-js/faker";
    
    const prisma = new PrismaClient();
    
    const PRESCRIPTION_STATUSES = ["ACTIVE", "COMPLETED", "CANCELLED"];
    
    const MEDICINES = [
      "Paracetamol",
      "Amoxicillin",
      "Azithromycin",
      "Ibuprofen",
      "Pantoprazole",
      "Metformin",
      "Cetirizine",
      "Dolo 650",
      "Crocin",
      "Augmentin",
    ];
    
    const DOSAGES = ["250mg", "500mg", "650mg", "1 tablet", "5ml"];
    
    const FREQUENCIES = [
      "Once Daily",
      "Twice Daily",
      "Three Times Daily",
      "Before Sleep",
      "After Food",
    ];
    
    const DURATIONS = ["3 Days", "5 Days", "7 Days", "10 Days", "14 Days"];
    
    async function seedPrescriptions(count = 100) {
      // ✅ First, get all existing admission IDs
      const existingAdmissions = await prisma.admission.findMany({
        select: { id: true },
      });
    
      if (existingAdmissions.length === 0) {
        console.error("❌ No admissions found! Please seed admissions first.");
        return;
      }
    
      const admissionIds = existingAdmissions.map((a) => a.id);
      console.log(`✅ Found ${admissionIds.length} existing admissions`);
    
      const batchSize = 50;
      const step = 1000 * 2; // 2 sec gap
    
      let baseTime = Date.now() - count * step;
      const year = new Date().getFullYear();
    
      const lastPrescription = await prisma.prescription.findFirst({
        orderBy: { id: "desc" },
        select: { prescriptionNo: true },
      });
    
      let seq = lastPrescription
        ? Number(lastPrescription.prescriptionNo.split("-")[2])
        : 0;
    
      console.log("📋 Starting prescription seed");
      console.time("Prescription Seeding");
    
      for (let i = 0; i < count; i += batchSize) {
        const prescriptions = [];
    
        for (let j = 0; j < batchSize && i + j < count; j++) {
          baseTime += step;
          seq++;
    
          const createdAt = new Date(baseTime);
          const updatedAt = createdAt;
          const prescriptionDate = createdAt;
    
          // ✅ Pick a random valid admission ID
          const admissionId = faker.helpers.arrayElement(admissionIds);
    
          prescriptions.push({
            prescriptionNo: `PRESC-${year}-${seq}`,
            admissionId,
            prescriptionDate,
            prescriptionDoc: faker.helpers.maybe(() => faker.internet.url(), {
              probability: 0.3,
            }),
            notes: faker.helpers.maybe(() => faker.lorem.paragraph(), {
              probability: 0.7,
            }),
            status: faker.helpers.arrayElement(PRESCRIPTION_STATUSES),
            createdAt,
            updatedAt,
          });
        }
    
        // ✅ Create prescriptions
        await prisma.prescription.createMany({
          data: prescriptions,
          skipDuplicates: true,
        });
    
        // ✅ Get created prescriptions for medicines
        const createdPrescriptions = await prisma.prescription.findMany({
          where: {
            prescriptionNo: {
              in: prescriptions.map((p) => p.prescriptionNo),
            },
          },
          select: { id: true, prescriptionNo: true },
        });
    
        const allMedicines = [];
    
        for (const prescription of createdPrescriptions) {
          const medicineCount = faker.number.int({
            min: 1,
            max: 4,
          });
    
          for (let k = 0; k < medicineCount; k++) {
            allMedicines.push({
              prescriptionId: prescription.id,
              medicineName: faker.helpers.arrayElement(MEDICINES),
              dosage: faker.helpers.arrayElement(DOSAGES),
              frequency: faker.helpers.arrayElement(FREQUENCIES),
              duration: faker.helpers.arrayElement(DURATIONS),
              instructions: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.7,
              }),
            });
          }
        }
    
        // ✅ Bulk create medicines
        if (allMedicines.length > 0) {
          await prisma.medicine.createMany({
            data: allMedicines,
            skipDuplicates: true,
          });
        }
    
        console.log(
          `✅ Inserted ${Math.min(i + batchSize, count)}/${count} prescriptions`,
        );
      }
    
      console.timeEnd("Prescription Seeding");
    }
    
    // 🚀 Run Seeder
    seedPrescriptions(100)
      .then(async () => {
        console.log("\n🎉 Done seeding prescriptions!");
    
        const sample = await prisma.prescription.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            medicines: true,
            admission: {
              include: {
                patient: true,
              },
            },
          },
        });
    
        console.log("\n📊 Latest 5 prescriptions:");
        sample.forEach((prescription) => {
          console.log(
            `ID: ${prescription.id} | ${prescription.prescriptionNo} | Patient: ${prescription.admission?.patient?.fullName} | Status: ${prescription.status} | Medicines: ${prescription.medicines.length}`,
          );
        });
    
        await prisma.$disconnect();
      })
      .catch(async (err) => {
        console.error("❌ Error seeding prescriptions:", err);
        await prisma.$disconnect();
        process.exit(1);
      });
    

      //////////////




      import { PrismaClient } from "@prisma/client";
      import { faker } from "@faker-js/faker";
      
      const prisma = new PrismaClient();
      
      const BILL_STATUSES = ["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"];
      const BILL_TYPES = ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"];
      
      const COMPANIES = [
        "Sun Pharma",
        "Cipla",
        "Dr. Reddy's",
        "Abbott",
        "Mankind Pharma",
        "Zydus Cadila",
        "Alkem Laboratories",
        "Torrent Pharmaceuticals",
      ];
      
      const SERVICES = [
        "Paracetamol 500mg",
        "Amoxicillin 250mg",
        "Omeprazole 20mg",
        "Metformin 500mg",
        "Atorvastatin 10mg",
        "CBC Test",
        "X-Ray Chest",
        "Ultrasound",
        "Consultation Fee",
        "Room Charges",
        "Nursing Care",
        "IV Fluids",
      ];
      
      async function seedBills(count = 100) {
        // ✅ Get all existing admissions with patient info
        const existingAdmissions = await prisma.admission.findMany({
          select: {
            id: true,
            patientId: true,
            patient: {
              select: {
                id: true,
                fullName: true,
                hospitalPatientId: true,
              },
            },
          },
        });
      
        if (existingAdmissions.length === 0) {
          console.error("❌ No admissions found! Please seed admissions first.");
          return;
        }
      
        console.log(`✅ Found ${existingAdmissions.length} existing admissions`);
      
        const batchSize = 20;
        const step = 1000 * 2; // 2 sec gap
      
        let baseTime = Date.now() - count * step;
      
        console.log("📋 Starting bill seed");
        console.time("Bill Seeding");
      
        for (let i = 0; i < count; i += batchSize) {
          for (let j = 0; j < batchSize && i + j < count; j++) {
            baseTime += step;
      
            const createdAt = new Date(baseTime);
            const billDate = createdAt;
            const updatedAt = createdAt;
      
            // ✅ Pick a random admission
            const admission = faker.helpers.arrayElement(existingAdmissions);
            
            // Generate random bill items
            const itemCount = faker.number.int({ min: 1, max: 5 });
            const billItems = [];
            let totalAmount = 0;
      
            for (let k = 0; k < itemCount; k++) {
              const quantity = faker.number.int({ min: 1, max: 10 });
              const mrp = faker.number.float({ min: 10, max: 5000, fractionDigits: 2 });
              const itemTotal = Number((quantity * mrp).toFixed(2));
              totalAmount += itemTotal;
      
              billItems.push({
                company: faker.helpers.arrayElement(COMPANIES),
                itemOrService: faker.helpers.arrayElement(SERVICES),
                quantity: quantity,
                mrp: mrp,
                totalAmount: itemTotal,
              });
            }
      
            // Round total amount to 2 decimals
            totalAmount = Number(totalAmount.toFixed(2));
      
            // ✅ Create bill first
            const bill = await prisma.bill.create({
              data: {
                billDate,
                billType: faker.helpers.arrayElement(BILL_TYPES),
                totalAmount: totalAmount,
                admissionId: admission.id,
                patientId: admission.patientId,
                status: faker.helpers.arrayElement(BILL_STATUSES),
                createdAt,
                updatedAt,
              },
            });
      
            // ✅ Create bill items with relation
            for (const item of billItems) {
              await prisma.billItem.create({
                data: {
                  company: item.company,
                  itemOrService: item.itemOrService,
                  quantity: item.quantity,
                  mrp: item.mrp,
                  totalAmount: item.totalAmount,
                  billId: bill.id,
                },
              });
            }
      
            if ((i + j + 1) % 10 === 0) {
              console.log(`✅ Inserted ${i + j + 1}/${count} bills`);
            }
          }
        }
      
        console.timeEnd("Bill Seeding");
      }
      
      // 🚀 Run Seeder
      seedBills(100)
        .then(async () => {
          console.log("\n🎉 Done seeding bills!");
      
          const sample = await prisma.bill.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
              admission: {
                include: {
                  patient: true,
                },
              },
              billItems: true,
            },
          });
      
          console.log("\n📊 Latest 5 bills:");
          sample.forEach((bill) => {
            console.log(
              `ID: ${bill.id} | Date: ${bill.billDate.toLocaleDateString()} | Patient: ${bill.admission?.patient?.fullName} | Amount: ₹${bill.totalAmount} | Status: ${bill.status} | Items: ${bill.billItems?.length || 0}`
            );
            
            // Show bill items
            if (bill.billItems && bill.billItems.length > 0) {
              const itemsList = bill.billItems.map(item => `${item.quantity}x ${item.itemOrService}`).join(", ");
              console.log(`  Items: ${itemsList}`);
            }
          });
      
          // Show statistics
          const totalBills = await prisma.bill.count();
          const totalAmount = await prisma.bill.aggregate({
            _sum: {
              totalAmount: true,
            },
          });
          
          console.log("\n📊 Bill Statistics:");
          console.log(`Total Bills: ${totalBills}`);
          console.log(`Total Amount: ₹${totalAmount._sum.totalAmount?.toFixed(2) || 0}`);
      
          await prisma.$disconnect();
        })
        .catch(async (err) => {
          console.error("❌ Error seeding bills:", err);
          await prisma.$disconnect();
          process.exit(1);
        });