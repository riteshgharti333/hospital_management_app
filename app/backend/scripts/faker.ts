import { PrismaClient, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const billTypes = ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"];
const billStatus = ["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"];
const genders = ["Male", "Female", "Other"];

const companies = ["Company A", "Company B", "Company C", "Company D"];
const services = [
  "Consultation",
  "X-Ray",
  "Blood Test",
  "Injection",
  "Medicine",
  "Scan",
];

const fakeAdmissionNo = () =>
  `ADM-${faker.string.alphanumeric(6).toUpperCase()}`;

async function seedBills(count: number) {
  for (let i = 0; i < count; i++) {
    const admissionDate = faker.date.between({
      from: faker.date.past({ years: 1 }),
      to: new Date(),
    });

    const dischargeDate =
      Math.random() > 0.6
        ? faker.date.soon({ days: 10, refDate: admissionDate })
        : null;

    const billDate = faker.date.between({
      from: admissionDate,
      to: dischargeDate || new Date(),
    });

    const billItemsCount = faker.number.int({ min: 1, max: 5 });

    const billItems: Prisma.BillItemCreateManyBillInput[] = [];

    for (let j = 0; j < billItemsCount; j++) {
      const quantity = faker.number.int({ min: 1, max: 5 });
      const mrp = Number(faker.finance.amount({ min: 50, max: 2000, dec: 2 }));

      billItems.push({
        company: faker.helpers.arrayElement(companies),
        itemOrService: faker.helpers.arrayElement(services),
        quantity,
        mrp,
        totalAmount: Number((quantity * mrp).toFixed(2)),
        createdAt: faker.date.recent({ days: 10 }),
      });
    }

    // ⭐ CALCULATE GRAND TOTAL OF BILL ITEMS
    const totalAmount = billItems.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    await prisma.bill.create({
      data: {
        billDate,
        billType: faker.helpers.arrayElement(billTypes),
        mobile: faker.string.numeric(10),
        admissionNo: fakeAdmissionNo(),
        patientName: faker.person.fullName(),
        admissionDate,
        patientAge: faker.number.int({ min: 1, max: 95 }),
        patientSex: faker.helpers.arrayElement(genders),
        dischargeDate,
        address: faker.location.streetAddress(),
        status: faker.helpers.arrayElement(billStatus),
        createdAt: faker.date.recent({ days: 60 }),
        updatedAt: faker.date.recent({ days: 60 }),

        totalAmount, // ⭐ SAVE BILL TOTAL

        billItems: {
          createMany: {
            data: billItems,
          },
        },
      },
    });

    console.log(`Inserted Bill ${i + 1}/${count}`);
  }
}

seedBills(10000)
  .then(async () => {
    console.log("✅ Completed inserting 10000 Bill records with totals!");
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error seeding Bills:", err);
    await prisma.$disconnect();
    process.exit(1);
  });



// import { PrismaClient, Prisma } from "@prisma/client";
// import { faker } from "@faker-js/faker";

// const prisma = new PrismaClient();

// const paymentModes = ["Cash", "Cheque", "Card", "Online Transfer", "Other"];

// const statuses = ["Active", "Cancelled", "Refunded"];

// // realistic hospital admission numbers
// const fakeAdmissionNo = () =>
//   `ADM-${faker.string.alphanumeric(6).toUpperCase()}`;

// async function seedMoneyReceipts(count: number) {
//   const batchSize = 1000;

//   for (let i = 0; i < count; i += batchSize) {
//     const receiptsBatch: Prisma.MoneyReceiptCreateManyInput[] = [];

//     for (let j = 0; j < batchSize && i + j < count; j++) {
//       const amount = Number(
//         faker.finance.amount({ min: 100, max: 20000, dec: 2 })
//       );

//       receiptsBatch.push({
//         date: faker.date.between({
//           from: faker.date.past({ years: 1 }),
//           to: new Date(),
//         }),

//         patientName: faker.person.fullName(),
//         mobile: faker.string.numeric(10),
//         amount: amount,
//         paymentMode: faker.helpers.arrayElement(paymentModes),
//         admissionNo: fakeAdmissionNo(),

//         remarks: Math.random() > 0.4 ? faker.lorem.sentence(4) : null,

//         receivedBy: faker.person.fullName(),

//         status: faker.helpers.arrayElement(statuses),

//         createdAt: faker.date.recent({ days: 60 }),
//         updatedAt: faker.date.recent({ days: 60 }),
//       });
//     }

//     await prisma.moneyReceipt.createMany({
//       data: receiptsBatch,
//     });

//     console.log(
//       `Inserted ${Math.min(i + batchSize, count)} / ${count} money receipts`
//     );
//   }
// }

// seedMoneyReceipts(10000)
//   .then(async () => {
//     console.log("✅ Completed inserting 10,000 MoneyReceipt records!");
//     await prisma.$disconnect();
//   })
//   .catch(async (err) => {
//     console.error("❌ Error seeding MoneyReceipts:", err);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

// // import { PrismaClient, Prisma } from "@prisma/client";
// // import { faker } from "@faker-js/faker";

// // const prisma = new PrismaClient();

// // const billTypes = ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology"];
// // const genders = ["Male", "Female", "Other"];
// // const statuses = ["Pending", "PartiallyPaid", "Paid", "Cancelled", "Refunded"];

// // const companies = ["Company A", "Company B", "Company C", "Company D"];
// // const items = [
// //   "Blood Test",
// //   "X-Ray",
// //   "CT Scan",
// //   "MRI",
// //   "Injection",
// //   "Medicine Pack",
// //   "Room Charges",
// //   "Consultation Fee",
// // ];

// // async function seedBills(count: number) {
// //   const billIds: number[] = [];

// //   console.log("🔵 Creating Bills...");

// //   for (let i = 0; i < count; i++) {
// //     const admissionDate = faker.date.past({ years: 1 });

// //     const bill = await prisma.bill.create({
// //       data: {
// //         billDate: faker.date.recent({ days: 90 }),
// //         billType: faker.helpers.arrayElement(billTypes),
// //         mobile: faker.string.numeric(10),
// //         admissionNo: `ADM-${faker.string.alphanumeric(6).toUpperCase()}`,
// //         patientName: faker.person.fullName(),
// //         admissionDate,
// //         patientAge: faker.number.int({ min: 1, max: 100 }),
// //         patientSex: faker.helpers.arrayElement(genders),
// //         dischargeDate:
// //           Math.random() > 0.5
// //             ? faker.date.between({ from: admissionDate, to: new Date() })
// //             : null,
// //         address: faker.location.streetAddress(),
// //         status: faker.helpers.arrayElement(statuses),
// //       },
// //     });

// //     billIds.push(bill.id);

// //     if ((i + 1) % 1000 === 0) {
// //       console.log(`Inserted ${i + 1}/${count} bills`);
// //     }
// //   }

// //   console.log("🟢 Bills created. Creating BillItems...");

// //   // Bill items batch
// //   const billItemsBatch: Prisma.BillItemCreateManyInput[] = [];

// //   for (const billId of billIds) {
// //     const numItems = faker.number.int({ min: 3, max: 8 });

// //     for (let k = 0; k < numItems; k++) {
// //       const quantity = faker.number.int({ min: 1, max: 5 });
// //       const mrp = Number(faker.finance.amount({ min: 100, max: 5000 }));
// //       const totalAmount = parseFloat((quantity * mrp).toFixed(2));

// //       billItemsBatch.push({
// //         billId,
// //         company: faker.helpers.arrayElement(companies),
// //         itemOrService: faker.helpers.arrayElement(items),
// //         quantity,
// //         mrp,
// //         totalAmount,
// //       });
// //     }
// //   }

// //   // Insert items in batches to prevent overload
// //   const chunkSize = 2000;

// //   for (let i = 0; i < billItemsBatch.length; i += chunkSize) {
// //     const chunk = billItemsBatch.slice(i, i + chunkSize);
// //     await prisma.billItem.createMany({ data: chunk });

// //     console.log(
// //       `Inserted ${Math.min(
// //         i + chunkSize,
// //         billItemsBatch.length
// //       )}/${billItemsBatch.length} bill items`
// //     );
// //   }

// //   console.log("✅ Completed inserting all bills + bill items");
// // }

// // seedBills(10000)
// //   .then(async () => {
// //     console.log("🎉 Done!");
// //     await prisma.$disconnect();
// //   })
// //   .catch(async (err) => {
// //     console.error("❌ Error seeding bills:", err);
// //     await prisma.$disconnect();
// //     process.exit(1);
// //   });

// //   // import { PrismaClient, Prisma } from "@prisma/client";
// // // import { faker } from "@faker-js/faker";

// // // const prisma = new PrismaClient();

// // // // Realistic bank names
// // // const bankNames = [
// // //   "HDFC Bank",
// // //   "ICICI Bank",
// // //   "State Bank of India",
// // //   "Axis Bank",
// // //   "Kotak Mahindra Bank",
// // //   "Punjab National Bank",
// // //   "Bank of Baroda",
// // //   "Canara Bank",
// // //   "Yes Bank",
// // //   "IDFC First Bank",
// // // ];

// // // const amountTypes = ["Credit", "Debit"];

// // // async function seedBankLedgers(count: number) {
// // //   const batchSize = 1000;

// // //   for (let i = 0; i < count; i += batchSize) {
// // //     const ledgerBatch: Prisma.BankLedgerCreateManyInput[] = [];

// // //     for (let j = 0; j < batchSize && i + j < count; j++) {
// // //       const amountType = faker.helpers.arrayElement(amountTypes);

// // //       ledgerBatch.push({
// // //         bankName: faker.helpers.arrayElement(bankNames),

// // //         date: faker.date.between({
// // //           from: faker.date.past({ years: 1 }),
// // //           to: new Date(),
// // //         }),

// // //         description: faker.helpers.arrayElement([
// // //           "Online Transfer",
// // //           "Cheque Deposit",
// // //           "ATM Withdrawal",
// // //           "UPI Settlement",
// // //           "Bank Charges",
// // //           "Salary Credit",
// // //           "Vendor Payment",
// // //           "Refund Processed",
// // //         ]),

// // //         amountType, // "Credit" or "Debit"

// // //         amount: parseFloat(
// // //           faker.finance.amount({ min: 500, max: 200000, dec: 2 })
// // //         ),

// // //         transactionId:
// // //           Math.random() > 0.25
// // //             ? `BNK-${faker.string.alphanumeric(12).toUpperCase()}`
// // //             : null,

// // //         remarks: Math.random() > 0.5 ? faker.lorem.sentence(4) : null,

// // //         createdAt: faker.date.recent({ days: 90 }),
// // //         updatedAt: faker.date.recent({ days: 90 }),
// // //       });
// // //     }

// // //     await prisma.bankLedger.createMany({
// // //       data: ledgerBatch,
// // //     });

// // //     console.log(
// // //       `Inserted ${Math.min(i + batchSize, count)} / ${count} bank ledgers`
// // //     );
// // //   }
// // // }

// // // seedBankLedgers(10000)
// // //   .then(async () => {
// // //     console.log("✅ Completed inserting 10,000 bank ledger records!");
// // //     await prisma.$disconnect();
// // //   })
// // //   .catch(async (err) => {
// // //     console.error("❌ Error seeding bank ledgers:", err);
// // // await prisma.$disconnect();
// // //     process.exit(1);
// // //   });

// // // // import { PrismaClient, Prisma } from "@prisma/client";
// // // // import { faker } from "@faker-js/faker";

// // // // const prisma = new PrismaClient();

// // // // // Hospital-related cash purposes
// // // // const purposes = [
// // // //   "OPD Cash Collection",
// // // //   "Emergency Charges",
// // // //   "Pharmacy Sales",
// // // //   "Canteen Income",
// // // //   "Ambulance Fees",
// // // //   "Doctor Consultation Fees",
// // // //   "Lab Test Income",
// // // //   "Operation Theatre Charges",
// // // //   "Advance Deposit Received",
// // // //   "Refund to Patient",
// // // //   "Vendor Payment",
// // // //   "Staff Salary",
// // // //   "Medical Equipment Purchase",
// // // //   "Maintenance Expense",
// // // //   "Housekeeping Expense",
// // // //   "Cash Withdrawal",
// // // //   "Cash Deposit to Bank",
// // // //   "Electricity Bill",
// // // //   "Oxygen Cylinder Purchase",
// // // //   "Cleaning Supplies Expense",
// // // // ];

// // // // const amountTypes = ["Income", "Expense"];

// // // // async function seedCashLedger(count: number) {
// // // //   const batchSize = 1000;

// // // //   for (let i = 0; i < count; i += batchSize) {
// // // //     const ledgerBatch: Prisma.CashLedgerCreateManyInput[] = [];

// // // //     for (let j = 0; j < batchSize && i + j < count; j++) {
// // // //       const amountType = faker.helpers.arrayElement(amountTypes);

// // // //       ledgerBatch.push({
// // // //         date: faker.date.between({
// // // //           from: faker.date.past({ years: 1 }),
// // // //           to: new Date(),
// // // //         }),

// // // //         purpose: faker.helpers.arrayElement(purposes),

// // // //         amountType, // "Income" or "Expense"

// // // //         amount: parseFloat(
// // // //           faker.finance.amount({
// // // //             min: 50,
// // // //             max: 200000,
// // // //             dec: 2,
// // // //           })
// // // //         ),

// // // //         remarks: Math.random() > 0.5 ? faker.lorem.sentence(4) : null,

// // // //         createdAt: faker.date.recent({ days: 90 }),
// // // //         updatedAt: faker.date.recent({ days: 90 }),
// // // //       });
// // // //     }

// // // //     await prisma.cashLedger.createMany({
// // // //       data: ledgerBatch,
// // // //     });

// // // //     console.log(
// // // //       `Inserted ${Math.min(i + batchSize, count)} / ${count} cash ledger rows`
// // // //     );
// // // //   }
// // // // }

// // // // seedCashLedger(10000)
// // // //   .then(async () => {
// // // //     console.log("✅ Completed inserting 10,000 cash ledger records!");
// // // //     await prisma.$disconnect();
// // // //   })
// // // //   .catch(async (err) => {
// // // //     console.error("❌ Error seeding cash ledger:", err);
// // // //     await prisma.$disconnect();
// // // //     process.exit(1);
// // // //   });

// // // // // import { PrismaClient, Prisma } from "@prisma/client";
// // // // // import { faker } from "@faker-js/faker";

// // // // // const prisma = new PrismaClient();

// // // // // const paymentModes = ["Cash", "UPI", "Bank Transfer", "Cheque", "Card"];
// // // // // const amountTypes = ["Credit", "Debit"];

// // // // // // realistic doctor names
// // // // // const doctorNames = Array.from({ length: 200 }).map(() =>
// // // // //   `Dr. ${faker.person.fullName()}`
// // // // // );

// // // // // // common hospital ledger descriptions
// // // // // const doctorDescriptions = [
// // // // //   "OPD Fee Settlement",
// // // // //   "Share from Surgery Charges",
// // // // //   "Consultation Fee",
// // // // //   "On-Call Duty Payment",
// // // // //   "Emergency Duty Payment",
// // // // //   "Doctor Incentive",
// // // // //   "Refund Adjustment",
// // // // //   "Advance Paid",
// // // // //   "Procedure Fee",
// // // // // ];

// // // // // async function seedDoctorLedgers(count: number) {
// // // // //   const batchSize = 1000;

// // // // //   for (let i = 0; i < count; i += batchSize) {
// // // // //     const ledgerBatch: Prisma.DoctorLedgerCreateManyInput[] = [];

// // // // //     for (let j = 0; j < batchSize && i + j < count; j++) {
// // // // //       const amountType = faker.helpers.arrayElement(amountTypes);

// // // // //       ledgerBatch.push({
// // // // //         doctorName: faker.helpers.arrayElement(doctorNames),

// // // // //         date: faker.date.between({
// // // // //           from: faker.date.past({ years: 1 }),
// // // // //           to: new Date(),
// // // // //         }),

// // // // //         description: faker.helpers.arrayElement(doctorDescriptions),

// // // // //         amountType, // Credit or Debit

// // // // //         amount: parseFloat(
// // // // //           faker.finance.amount({ min: 500, max: 50000, dec: 2 })
// // // // //         ),

// // // // //         paymentMode: faker.helpers.arrayElement(paymentModes),

// // // // //         transactionId:
// // // // //           Math.random() > 0.3
// // // // //             ? `DOC-${faker.string.alphanumeric(10).toUpperCase()}`
// // // // //             : null,

// // // // //         remarks: Math.random() > 0.5 ? faker.lorem.sentence(4) : null,

// // // // //         createdAt: faker.date.recent({ days: 60 }),
// // // // //         updatedAt: faker.date.recent({ days: 60 }),
// // // // //       });
// // // // //     }

// // // // //     await prisma.doctorLedger.createMany({
// // // // //       data: ledgerBatch,
// // // // //     });

// // // // //     console.log(
// // // // //       `Inserted ${Math.min(i + batchSize, count)} / ${count} doctor ledger records`
// // // // //     );
// // // // //   }
// // // // // }

// // // // // seedDoctorLedgers(10000)
// // // // //   .then(async () => {
// // // // //     console.log("✅ Completed inserting 10,000 doctor ledger entries!");
// // // // //     await prisma.$disconnect();
// // // // //   })
// // // // //   .catch(async (err) => {
// // // // //     console.error("❌ Error seeding doctor ledger:", err);
// // // // //     await prisma.$disconnect();
// // // // //     process.exit(1);
// // // // //   });

// // // // // // import { PrismaClient, Prisma } from "@prisma/client";
// // // // // // import { faker } from "@faker-js/faker";

// // // // // // const prisma = new PrismaClient();

// // // // // // const paymentModes = ["Cash", "Card", "UPI", "Bank Transfer", "Cheque"];
// // // // // // const amountTypes = ["Credit", "Debit"];

// // // // // // async function seedPatientLedgers(count: number) {
// // // // // //   const batchSize = 1000;

// // // // // //   for (let i = 0; i < count; i += batchSize) {
// // // // // //     const ledgerBatch: Prisma.PatientLedgerCreateManyInput[] = [];

// // // // // //     for (let j = 0; j < batchSize && i + j < count; j++) {
// // // // // //       const amountType = faker.helpers.arrayElement(amountTypes);

// // // // // //       ledgerBatch.push({
// // // // // //         patientName: faker.person.fullName(),

// // // // // //         date: faker.date.between({
// // // // // //           from: faker.date.past({ years: 1 }),
// // // // // //           to: new Date(),
// // // // // //         }),

// // // // // //         description: faker.helpers.arrayElement([
// // // // // //           "OPD Bill Payment",
// // // // // //           "Medicine Purchase",
// // // // // //           "Admission Charges",
// // // // // //           "Lab Test Fees",
// // // // // //           "Refund for Overpayment",
// // // // // //           "Advance Deposit",
// // // // // //           "Emergency Service Charges",
// // // // // //         ]),

// // // // // //         amountType,

// // // // // //         amount: parseFloat(faker.finance.amount({ min: 100, max: 10000, dec: 2 })),

// // // // // //         paymentMode: faker.helpers.arrayElement(paymentModes),

// // // // // //         transactionId:
// // // // // //           Math.random() > 0.3
// // // // // //             ? `TXN-${faker.string.alphanumeric(10).toUpperCase()}`
// // // // // //             : null,

// // // // // //         remarks:
// // // // // //           Math.random() > 0.5 ? faker.lorem.sentence(5) : null,

// // // // // //         createdAt: faker.date.recent({ days: 60 }),
// // // // // //         updatedAt: faker.date.recent({ days: 60 }),
// // // // // //       });
// // // // // //     }

// // // // // //     await prisma.patientLedger.createMany({
// // // // // //       data: ledgerBatch,
// // // // // //     });

// // // // // //     console.log(`Inserted ${Math.min(i + batchSize, count)} / ${count} ledgers`);
// // // // // //   }
// // // // // // }

// // // // // // seedPatientLedgers(10000)
// // // // // //   .then(async () => {
// // // // // //     console.log("✅ Completed inserting 10,000 fake patient ledger entries!");
// // // // // //     await prisma.$disconnect();
// // // // // //   })
// // // // // //   .catch(async (err) => {
// // // // // //     console.error("❌ Error seeding patient ledger:", err);
// // // // // //     await prisma.$disconnect();
// // // // // //     process.exit(1);
// // // // // //   });

// // // // // // // import { PrismaClient, Prisma } from "@prisma/client";
// // // // // // // import { faker } from "@faker-js/faker";

// // // // // // // const prisma = new PrismaClient();

// // // // // // // // Same departments you added earlier
// // // // // // // const departmentNames = [
// // // // // // //   "Cardiology", "Neurology", "Orthopedics", "Gynecology", "Pediatrics",
// // // // // // //   "Dermatology", "Radiology", "Pathology", "General Surgery",
// // // // // // //   "ENT (Ear Nose Throat)", "Urology", "Nephrology", "Gastroenterology",
// // // // // // //   "Oncology", "Endocrinology", "Hematology", "Physiotherapy",
// // // // // // //   "Psychiatry", "Ophthalmology", "Dental", "Emergency Medicine",
// // // // // // //   "ICU", "Neonatology", "Anesthesiology", "Plastic Surgery",
// // // // // // //   "Pulmonology", "Infectious Diseases", "Rheumatology",
// // // // // // //   "Nutrition & Dietetics", "Hospital Administration"
// // // // // // // ];

// // // // // // // // Common hospital qualifications
// // // // // // // const qualifications = [
// // // // // // //   "MBBS", "MD", "MS", "DM", "MCh", "DNB", "BDS", "MDS", "PhD (Medical)"
// // // // // // // ];

// // // // // // // // Common designations
// // // // // // // const designations = [
// // // // // // //   "Consultant", "Senior Consultant", "Junior Doctor",
// // // // // // //   "Attending Physician", "Resident Doctor", "Head of Department",
// // // // // // //   "Surgeon", "Senior Surgeon", "Medical Officer"
// // // // // // // ];

// // // // // // // // Hospital specializations
// // // // // // // const specializations = [
// // // // // // //   "Cardiologist", "Neurologist", "Orthopedic Surgeon", "Gynecologist",
// // // // // // //   "Pediatrician", "Dermatologist", "Radiologist", "Pathologist",
// // // // // // //   "General Surgeon", "ENT Specialist", "Urologist", "Nephrologist",
// // // // // // //   "Gastroenterologist", "Oncologist", "Endocrinologist", "Hematologist",
// // // // // // //   "Psychiatrist", "Ophthalmologist", "Dentist", "Anesthesiologist",
// // // // // // //   "Plastic Surgeon", "Pulmonologist", "Infectious Disease Specialist",
// // // // // // //   "Rheumatologist", "Physiotherapist"
// // // // // // // ];

// // // // // // // async function seedDoctors(count: number) {
// // // // // // //   const doctors: Prisma.DoctorCreateManyInput[] = [];

// // // // // // //   for (let i = 0; i < count; i++) {
// // // // // // //     const dept = faker.helpers.arrayElement(departmentNames);
// // // // // // //     const specialization = faker.helpers.arrayElement(specializations);

// // // // // // //     doctors.push({
// // // // // // //       fullName: faker.person.fullName(),
// // // // // // //       mobileNumber: faker.string.numeric(10), // at least 10 digits ✔
// // // // // // //       registrationNo: `REG-${i + 1}-${faker.string.alphanumeric(4).toUpperCase()}`, // unique ✔

// // // // // // //       qualification: faker.helpers.arrayElement(qualifications),
// // // // // // //       designation: faker.helpers.arrayElement(designations),

// // // // // // //       department: dept,
// // // // // // //       specialization,

// // // // // // //       status: "Active",

// // // // // // //       createdAt: faker.date.recent({ days: 90 }),
// // // // // // //       updatedAt: faker.date.recent({ days: 90 }),
// // // // // // //     });
// // // // // // //   }

// // // // // // //   await prisma.doctor.createMany({
// // // // // // //     data: doctors,
// // // // // // //     skipDuplicates: true, // avoid unique conflicts
// // // // // // //   });

// // // // // // //   console.log(`✅ Successfully inserted ${count} doctors!`);
// // // // // // // }

// // // // // // // seedDoctors(500)
// // // // // // //   .catch(async (err) => {
// // // // // // //     console.error("❌ Error seeding doctors:", err);
// // // // // // //     await prisma.$disconnect();
// // // // // // //     process.exit(1);
// // // // // // //   })
// // // // // // //   .finally(async () => {
// // // // // // //     await prisma.$disconnect();
// // // // // // //   });

// // // // // // // // import { PrismaClient } from "@prisma/client";
// // // // // // // // import { faker } from "@faker-js/faker";

// // // // // // // // const prisma = new PrismaClient();

// // // // // // // // const departmentNames = [
// // // // // // // //   "Cardiology",
// // // // // // // //   "Neurology",
// // // // // // // //   "Orthopedics",
// // // // // // // //   "Gynecology",
// // // // // // // //   "Pediatrics",
// // // // // // // //   "Dermatology",
// // // // // // // //   "Radiology",
// // // // // // // //   "Pathology",
// // // // // // // //   "General Surgery",
// // // // // // // //   "ENT (Ear Nose Throat)",
// // // // // // // //   "Urology",
// // // // // // // //   "Nephrology",
// // // // // // // //   "Gastroenterology",
// // // // // // // //   "Oncology",
// // // // // // // //   "Endocrinology",
// // // // // // // //   "Hematology",
// // // // // // // //   "Physiotherapy",
// // // // // // // //   "Psychiatry",
// // // // // // // //   "Ophthalmology",
// // // // // // // //   "Dental",
// // // // // // // //   "Emergency Medicine",
// // // // // // // //   "ICU",
// // // // // // // //   "Neonatology",
// // // // // // // //   "Anesthesiology",
// // // // // // // //   "Plastic Surgery",
// // // // // // // //   "Pulmonology",
// // // // // // // //   "Infectious Diseases",
// // // // // // // //   "Rheumatology",
// // // // // // // //   "Nutrition & Dietetics",
// // // // // // // //   "Hospital Administration"
// // // // // // // // ];

// // // // // // // // async function seedDepartments() {
// // // // // // // //   const departments = departmentNames.map((name) => ({
// // // // // // // //     name,
// // // // // // // //     head: faker.person.fullName(),
// // // // // // // //     contactNumber: faker.string.numeric(10),
// // // // // // // //     email: faker.internet.email({ firstName: name.replace(/\s/g, "") }),
// // // // // // // //     location: faker.location.streetAddress(),
// // // // // // // //     description: `${name} department handles all cases related to ${name}.`,
// // // // // // // //     status: "Active",
// // // // // // // //     createdAt: faker.date.recent({ days: 60 }),
// // // // // // // //     updatedAt: faker.date.recent({ days: 60 }),
// // // // // // // //   }));

// // // // // // // //   await prisma.department.createMany({
// // // // // // // //     data: departments,
// // // // // // // //     skipDuplicates: true, // avoid unique name errors
// // // // // // // //   });

// // // // // // // //   console.log("✅ Inserted 30 hospital departments successfully!");
// // // // // // // // }

// // // // // // // // seedDepartments()
// // // // // // // //   .catch((e) => {
// // // // // // // //     console.error(e);
// // // // // // // //     process.exit(1);
// // // // // // // //   })
// // // // // // // //   .finally(async () => {
// // // // // // // //     await prisma.$disconnect();
// // // // // // // //   });

// // // // // // // // import { PrismaClient, Prisma } from "@prisma/client";
// // // // // // // // import { faker } from "@faker-js/faker";

// // // // // // // // const prisma = new PrismaClient();

// // // // // // // // async function generateFakePatients(count: number) {
// // // // // // // //   const batchSize = 1000; // inserts in batches of 1000 for performance

// // // // // // // //   for (let i = 0; i < count; i += batchSize) {
// // // // // // // //     const patientBatch: Prisma.PatientCreateManyInput[] = [];

// // // // // // // //     for (let j = 0; j < batchSize && i + j < count; j++) {
// // // // // // // //       patientBatch.push({
// // // // // // // //         fullName: faker.person.fullName(),

// // // // // // // //         age: faker.number.int({ min: 1, max: 100 }),

// // // // // // // //         mobileNumber: faker.string.numeric(10), // FIXED

// // // // // // // //         gender: faker.helpers.arrayElement(["Male", "Female", "Other"]),

// // // // // // // //         bedNumber: `B-${faker.number.int({ min: 1, max: 500 })}`,

// // // // // // // //         aadhaarNumber: faker.string.numeric(12), // FIXED

// // // // // // // //         address: faker.location.streetAddress(),

// // // // // // // //         medicalHistory: faker.lorem.sentence(),

// // // // // // // //         createdAt: faker.date.recent({ days: 60 }),
// // // // // // // //         updatedAt: faker.date.recent({ days: 60 }),
// // // // // // // //       });
// // // // // // // //     }

// // // // // // // //     await prisma.patient.createMany({
// // // // // // // //       data: patientBatch,
// // // // // // // //     });

// // // // // // // //     console.log(
// // // // // // // //       `Inserted ${Math.min(i + batchSize, count)} / ${count} patients`
// // // // // // // //     );
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // generateFakePatients(10000) // 👉 ONLY 10K as you requested
// // // // // // // //   .then(async () => {
// // // // // // // //     console.log("✅ Finished inserting 10,000 fake patients!");
// // // // // // // //     await prisma.$disconnect();
// // // // // // // //   })
// // // // // // // //   .catch(async (e) => {
// // // // // // // //     console.error("❌ Seeder failed:", e);
// // // // // // // //     await prisma.$disconnect();
// // // // // // // //     process.exit(1);
// // // // // // // //   });
