import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const PAYMENT_MODES = ["Cash", "Cheque", "Card", "Online Transfer", "Other"];
const RECEIPT_STATUSES = ["Active", "Cancelled", "Refunded"];

async function seedMoneyReceipts(count = 100) {
  // ✅ Get all existing admissions with patient info
  const existingAdmissions = await prisma.admission.findMany({
    select: {
      id: true,
      patientId: true,
      patient: {
        select: {
          id: true,
          fullName: true,
          mobileNumber: true,
        },
      },
    },
  });

  if (existingAdmissions.length === 0) {
    console.error("❌ No admissions found! Please seed admissions first.");
    return;
  }

  console.log(`✅ Found ${existingAdmissions.length} existing admissions`);

  const batchSize = 50;
  const step = 1000 * 2; // 2 sec gap

  let baseTime = Date.now() - count * step;

  console.log("📋 Starting money receipt seed");
  console.time("Money Receipt Seeding");

  let insertedCount = 0;

  for (let i = 0; i < count; i += batchSize) {
    const receipts = [];

    for (let j = 0; j < batchSize && i + j < count; j++) {
      baseTime += step;

      const createdAt = new Date(baseTime);
      const receiptDate = createdAt;
      const updatedAt = createdAt;

      // ✅ Pick a random admission
      const admission = faker.helpers.arrayElement(existingAdmissions);

      const amount = faker.number.float({
        min: 100,
        max: 50000,
        fractionDigits: 2,
      });

      receipts.push({
        date: receiptDate,
        amount: amount,
        paymentMode: faker.helpers.arrayElement(PAYMENT_MODES),
        remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.3,
        }),
        receivedBy: faker.person.fullName(),
        status: faker.helpers.arrayElement(RECEIPT_STATUSES),
        admissionId: admission.id,
        patientId: admission.patientId,
        createdAt,
        updatedAt,
      });
    }

    // ✅ Create money receipts
    for (const receipt of receipts) {
      await prisma.moneyReceipt.create({
        data: {
          date: receipt.date,
          amount: receipt.amount,
          paymentMode: receipt.paymentMode,
          remarks: receipt.remarks,
          receivedBy: receipt.receivedBy,
          status: receipt.status,
          admissionId: receipt.admissionId,
          patientId: receipt.patientId,
          createdAt: receipt.createdAt,
          updatedAt: receipt.updatedAt,
        },
      });
      insertedCount++;
    }

    console.log(
      `✅ Inserted ${Math.min(i + batchSize, count)}/${count} money receipts`,
    );
  }

  console.timeEnd("Money Receipt Seeding");
  console.log(`📊 Total inserted: ${insertedCount} money receipts`);
}

// 🚀 Run Seeder
seedMoneyReceipts(300)
  .then(async () => {
    console.log("\n🎉 Done seeding money receipts!");

    const sample = await prisma.moneyReceipt.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        admission: {
          include: {
            patient: true,
          },
        },
      },
    });

    console.log("\n📊 Latest 5 money receipts:");
    sample.forEach((receipt, index) => {
      console.log(`\n${index + 1}. ID: ${receipt.id}`);
      console.log(`   Date: ${receipt.date.toLocaleDateString()}`);
      console.log(
        `   Patient: ${receipt.admission?.patient?.fullName || "N/A"}`,
      );
      console.log(`   Amount: ₹${receipt.amount.toFixed(2)}`);
      console.log(`   Payment Mode: ${receipt.paymentMode}`);
      console.log(`   Received By: ${receipt.receivedBy}`);
      console.log(`   Status: ${receipt.status}`);
      if (receipt.remarks) {
        console.log(`   Remarks: ${receipt.remarks}`);
      }
    });

    // Show statistics
    const totalReceipts = await prisma.moneyReceipt.count();
    const totalAmount = await prisma.moneyReceipt.aggregate({
      _sum: {
        amount: true,
      },
    });

    const statusStats = await prisma.moneyReceipt.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      _sum: {
        amount: true,
      },
    });

    const paymentModeStats = await prisma.moneyReceipt.groupBy({
      by: ["paymentMode"],
      _count: {
        paymentMode: true,
      },
      _sum: {
        amount: true,
      },
    });

    console.log("\n📊 Money Receipt Statistics:");
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Total Receipts: ${totalReceipts}`);
    console.log(`Total Amount: ₹${totalAmount._sum.amount?.toFixed(2) || 0}`);
    console.log(
      `Average Amount: ₹${((totalAmount._sum.amount || 0) / totalReceipts).toFixed(2)}`,
    );

    console.log("\n📊 Status Breakdown:");
    statusStats.forEach((stat) => {
      const percentage = ((stat._count.status / totalReceipts) * 100).toFixed(
        1,
      );
      console.log(
        `  ${stat.status}: ${stat._count.status} receipts (${percentage}%) - ₹${stat._sum.amount?.toFixed(2) || 0}`,
      );
    });

    console.log("\n📊 Payment Mode Breakdown:");
    paymentModeStats.forEach((stat) => {
      const percentage = (
        (stat._count.paymentMode / totalReceipts) *
        100
      ).toFixed(1);
      console.log(
        `  ${stat.paymentMode}: ${stat._count.paymentMode} receipts (${percentage}%) - ₹${stat._sum.amount?.toFixed(2) || 0}`,
      );
    });

    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error("❌ Error seeding money receipts:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
