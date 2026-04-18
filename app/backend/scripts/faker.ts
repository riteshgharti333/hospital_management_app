import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedMoneyReceipts() {
  const batchSize = 25;
  const paymentModes = ["Cash", "Cheque", "Card", "Online Transfer", "Other"];
  const statuses = ["Active", "Cancelled", "Refunded"];
  const staffNames = [
    "Ritesh",
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
  ];

  // Use the same patient data for all receipts
  const patientData = {
    patientName: "Miss Melody Barrows-Luettgen",
    mobile: "8130088706",
    admissionNo: "ADM-2026-000049"
  };

  console.log(`📊 Creating 50 money receipts for: ${patientData.patientName}`);

  // Get the last money receipt to maintain chronological order
  const lastReceipt = await prisma.moneyReceipt.findFirst({
    orderBy: { id: "desc" },
    select: {
      id: true,
      createdAt: true,
    },
  });

  let baseTime = lastReceipt
    ? new Date(lastReceipt.createdAt).getTime()
    : Date.now() - 1000 * 60 * 60 * 24 * 30; // Start 30 days ago

  const step = 1000 * 60 * 60 * 2; // 2 hours between receipts

  console.log(`📋 Starting money receipt seed`);
  console.time("Money Receipt Seeding");

  let totalCreated = 0;
  const count = 50;

  for (let i = 0; i < count; i += batchSize) {
    const batch = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      baseTime += step;

      const createdAt = new Date(baseTime);
      
      // Generate receipt date (within last 30 days)
      const receiptDate = new Date(
        createdAt.getTime() - 1000 * 60 * 60 * faker.number.int({ min: 1, max: 48 })
      );
      
      // Set to start of day for consistency
      receiptDate.setHours(0, 0, 0, 0);

      // Generate amount between 100 and 50000
      const amount = faker.number.int({ min: 100, max: 50000 });

      const paymentMode = faker.helpers.arrayElement(paymentModes);
      const status = faker.helpers.arrayElement(statuses);
      const receivedBy = faker.helpers.arrayElement(staffNames);

      // Generate remarks based on payment mode
      let remarks = "";
      if (paymentMode === "Cheque") {
        remarks = `Cheque No: ${faker.string.alphanumeric(6).toUpperCase()}`;
      } else if (paymentMode === "Card") {
        remarks = `Transaction ID: ${faker.string.alphanumeric(12).toUpperCase()}`;
      } else if (paymentMode === "Online Transfer") {
        remarks = `UTR: ${faker.string.alphanumeric(16).toUpperCase()}`;
      } else if (paymentMode === "Cash") {
        remarks = faker.helpers.arrayElement([
          "Partial payment",
          "Full payment",
          "Advance payment",
          "",
        ]);
      }

      batch.push({
        date: receiptDate,
        patientName: patientData.patientName,
        mobile: patientData.mobile,
        admissionNo: patientData.admissionNo,
        amount,
        paymentMode,
        remarks: remarks || "",
        receivedBy,
        status,
        createdAt,
        updatedAt: createdAt,
      });
    }

    const result = await prisma.moneyReceipt.createMany({
      data: batch,
      skipDuplicates: true,
    });

    totalCreated += result.count;
    console.log(`✅ Inserted ${Math.min(i + batchSize, count)}/${count} receipts`);
  }

  console.timeEnd("Money Receipt Seeding");
  console.log(`\n📊 Total receipts created: ${totalCreated}`);
}

seedMoneyReceipts()
  .then(async () => {
    console.log("\n🎉 Done seeding 50 money receipts!");

    // Show sample of created receipts
    const sample = await prisma.moneyReceipt.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    console.log("\n📊 Latest 5 money receipts:");
    sample.forEach((r) => {
      console.log(`  ID: ${r.id} | Amount: ₹${r.amount}`);
      console.log(`     Payment: ${r.paymentMode} | Status: ${r.status}`);
      console.log(`     Received by: ${r.receivedBy} | Date: ${r.date.toISOString().split('T')[0]}`);
      console.log("");
    });

    // Show statistics
    const stats = await prisma.moneyReceipt.aggregate({
      _count: true,
      _sum: { amount: true },
      _avg: { amount: true },
      _min: { amount: true },
      _max: { amount: true },
    });

    console.log("\n📊 Money Receipt Statistics:");
    console.log(`  Total Receipts: ${stats._count}`);
    console.log(`  Total Amount: ₹${stats._sum.amount || 0}`);
    console.log(`  Average Amount: ₹${Math.round(stats._avg.amount || 0)}`);
    console.log(`  Min Amount: ₹${stats._min.amount || 0}`);
    console.log(`  Max Amount: ₹${stats._max.amount || 0}`);

    // Payment mode breakdown
    const paymentStats = await prisma.moneyReceipt.groupBy({
      by: ["paymentMode"],
      _count: true,
    });

    console.log("\n📊 Payment Mode Breakdown:");
    paymentStats.forEach((stat) => {
      console.log(`  ${stat.paymentMode}: ${stat._count} receipts`);
    });

    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error seeding money receipts:", err);
    await prisma.$disconnect();
    process.exit(1);
  });