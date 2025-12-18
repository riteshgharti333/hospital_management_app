import { prisma } from "../lib/prisma";
import { withDashboardCache } from "../utils/dashboardCache";

const format = (num: number) => Number(num.toFixed(2));

/* ======================================================
   REVENUE ANALYTICS
====================================================== */
export const getRevenueAnalytics = () =>
  withDashboardCache({
    key: "dashboard:revenue",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const now = new Date();

      // ============================
      // DATE RANGES
      // ============================
      const threeMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 3,
        now.getDate()
      );

      const sixMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 6,
        now.getDate()
      );

      const oneYearAgo = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      );

      // MONTH SPECIFIC RANGES
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // ============================
      // HELPER
      // ============================
      const sumRevenue = async (from: Date, to: Date = now) => {
        const result = await prisma.moneyReceipt.aggregate({
          _sum: { amount: true },
          where: { date: { gte: from, lte: to } },
        });
        return format(result._sum.amount || 0);
      };

      // ============================
      // MAIN VALUES
      // ============================
      const threeMonths = await sumRevenue(threeMonthsAgo);
      const sixMonths = await sumRevenue(sixMonthsAgo);
      const oneYear = await sumRevenue(oneYearAgo);

      const totalAgg = await prisma.moneyReceipt.aggregate({
        _sum: { amount: true },
      });

      const total = format(totalAgg._sum.amount || 0);

      // ============================
      // CURRENT VS PREVIOUS MONTH
      // ============================
      const currentMonth = await sumRevenue(currentMonthStart);
      const previousMonth = await sumRevenue(
        previousMonthStart,
        previousMonthEnd
      );

      const percentChange = previousMonth
        ? format(((currentMonth - previousMonth) / previousMonth) * 100)
        : 0;

      return {
        threeMonths,
        sixMonths,
        oneYear,
        total,
        currentMonth,
        previousMonth,
        percentChange,
      };
    },
  });

/* ======================================================
   PAYMENT MODE BREAKDOWN
====================================================== */
export const getPaymentModeBreakdownAnalytics = () =>
  withDashboardCache({
    key: "dashboard:payment-mode-breakdown",
    ttlSeconds: 10 * 60,
    fetcher: async () => {
      const paymentModes = [
        "Online Transfer",
        "Card",
        "Cash",
        "Cheque",
        "Other",
      ];

      const now = new Date();

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      // Helpers
      const sumAmount = async (where: any) => {
        const result = await prisma.moneyReceipt.aggregate({
          _sum: { amount: true },
          where,
        });
        return result._sum.amount || 0;
      };

      const buildStats = async (from?: Date) => {
        const where = from ? { date: { gte: from, lte: now } } : {};

        const totalAmount = await sumAmount(where);

        const amounts = await Promise.all(
          paymentModes.map((mode) => sumAmount({ ...where, paymentMode: mode }))
        );

        const percentages = amounts.map((amt) =>
          totalAmount === 0 ? 0 : Number(((amt / totalAmount) * 100).toFixed(2))
        );

        return {
          totalAmount: Number(totalAmount.toFixed(2)),
          paymentModes,
          amounts: amounts.map((a) => Number(a.toFixed(2))),
          percentages,
        };
      };

      return {
        allTime: await buildStats(),
        threeMonths: await buildStats(threeMonthsAgo),
        sixMonths: await buildStats(sixMonthsAgo),
        oneYear: await buildStats(oneYearAgo),
      };
    },
  });

/* ======================================================
   BILL STATUS ANALYTICS
====================================================== */
export const getBillStatusAnalytics = () =>
  withDashboardCache({
    key: "dashboard:bill-status",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const now = new Date();

      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const statuses = [
        "Pending",
        "PartiallyPaid",
        "Paid",
        "Cancelled",
        "Refunded",
      ];

      // Count bills by status & date
      const countBills = async (status: string, from?: Date, to?: Date) => {
        const where: any = { status };

        if (from && to) where.billDate = { gte: from, lte: to };
        if (from && !to) where.billDate = { gte: from };

        return prisma.bill.count({ where });
      };

      const percent = (curr: number, prev: number) => {
        if (!prev) return 0;
        return Number((((curr - prev) / prev) * 100).toFixed(2));
      };

      const result: any = {};

      for (const s of statuses) {
        const total = await countBills(s);
        const currentMonth = await countBills(s, currentMonthStart, now);
        const previousMonth = await countBills(
          s,
          previousMonthStart,
          previousMonthEnd
        );

        result[s] = total; // total bill count
        result[`${s}Curr`] = currentMonth; // current month count
        result[`${s}Prev`] = previousMonth; // previous month count
        result[`${s}Change`] = percent(currentMonth, previousMonth); // % change
      }

      return result;
    },
  });

/* ======================================================
   MONTHLY BILLING VS RECEIPT
====================================================== */
export const getMonthlyBillingVsReceipt = () =>
  withDashboardCache({
    key: "dashboard:monthly-billing-vs-receipt",
    ttlSeconds: 10 * 60,
    fetcher: async () => {
      const year = new Date().getFullYear();

      const format = (n: number) => Number(n.toFixed(2));

      // --------------------------------
      // 1. BILLING (sum of BillItem.totalAmount)
      // --------------------------------
      const billingQuery = await prisma.$queryRaw<
        { month: number; total: number }[]
      >`
        SELECT 
          EXTRACT(MONTH FROM b."createdAt") AS month,
          SUM(b."totalAmount") AS total
        FROM "BillItem" b
        WHERE EXTRACT(YEAR FROM b."createdAt") = ${year}
        GROUP BY month
        ORDER BY month ASC;
      `;

      const billingMonthly = Array(12).fill(0);
      billingQuery.forEach((row) => {
        billingMonthly[row.month - 1] = format(Number(row.total));
      });

      // --------------------------------
      // 2. MONEY RECEIPTS
      // --------------------------------
      const receiptQuery = await prisma.$queryRaw<
        { month: number; total: number }[]
      >`
        SELECT 
          EXTRACT(MONTH FROM "date") AS month,
          SUM("amount") AS total
        FROM "MoneyReceipt"
        WHERE EXTRACT(YEAR FROM "date") = ${year}
        GROUP BY month
        ORDER BY month ASC;
      `;

      const receiptMonthly = Array(12).fill(0);
      receiptQuery.forEach((row) => {
        receiptMonthly[row.month - 1] = format(Number(row.total));
      });

      // --------------------------------
      // 3. TOTALS
      // --------------------------------
      const totalBilling = format(billingMonthly.reduce((a, b) => a + b, 0));
      const totalReceipt = format(receiptMonthly.reduce((a, b) => a + b, 0));

      return {
        year,
        billingMonthly,
        receiptMonthly,
        totalBilling,
        totalReceipt,
      };
    },
  });

/* ======================================================
   BILLS BY STATUS ANALYTICS
====================================================== */
export const getBillsByStatusAnalytics = () =>
  withDashboardCache({
    key: "dashboard:bills-by-status",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const statuses = [
        "Pending",
        "PartiallyPaid",
        "Paid",
        "Cancelled",
        "Refunded",
      ];

      const now = new Date();

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      // Helper: returns { totalBills, statuses, counts, percentages }
      const buildStatusStats = async (from?: Date) => {
        const where: any = {};

        if (from) {
          where.createdAt = { gte: from, lte: now };
        }

        const totalBills = await prisma.bill.count({ where });

        const counts = await Promise.all(
          statuses.map((status) =>
            prisma.bill.count({
              where: { ...where, status },
            })
          )
        );

        const percentages = counts.map((count) =>
          totalBills === 0 ? 0 : Number(((count / totalBills) * 100).toFixed(2))
        );

        return {
          totalBills,
          statuses,
          counts,
          percentages,
        };
      };

      return {
        allTime: await buildStatusStats(),
        threeMonths: await buildStatusStats(threeMonthsAgo),
        sixMonths: await buildStatusStats(sixMonthsAgo),
        oneYear: await buildStatusStats(oneYearAgo),
      };
    },
  });

/* ======================================================
   PATIENT ANALYTICS
====================================================== */
export const getPatientAnalytics = () =>
  withDashboardCache({
    key: "dashboard:patients",
    ttlSeconds: 10 * 60,
    fetcher: async () => {
      const now = new Date();

      // ============= TIME RANGES =============

      // Last 3 Months
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);

      // Last 6 Months
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      // Last 1 Year
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      // Current Month
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Previous Month
      const previousMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Helper function to count patients in a date range
      const countPatients = async (from?: Date, to?: Date) => {
        const where: any = {};
        if (from || to) {
          where.createdAt = {
            gte: from,
            lte: to || now,
          };
        }
        return prisma.patient.count({ where });
      };

      // % logic
      const percent = (curr: number, prev: number) => {
        if (!prev) return 0;
        return Number((((curr - prev) / prev) * 100).toFixed(2));
      };

      // Compute values
      const currentMonth = await countPatients(currentMonthStart);
      const previousMonth = await countPatients(
        previousMonthStart,
        previousMonthEnd
      );

      return {
        total: await prisma.patient.count(),

        // Updated ranges
        threeMonths: await countPatients(threeMonthsAgo),
        sixMonths: await countPatients(sixMonthsAgo),
        oneYear: await countPatients(oneYearAgo),

        currentMonth,
        previousMonth,

        percentChange: percent(currentMonth, previousMonth),
      };
    },
  });

/* ======================================================
   PATIENT AGE DISTRIBUTION
====================================================== */
export const getPatientAgeDistribution = () =>
  withDashboardCache({
    key: "dashboard:patient-age-distribution",
    ttlSeconds: 30 * 60, // 30 minutes cache since this doesn't change often
    fetcher: async () => {
      // Fetch only required fields for speed
      const patients = await prisma.patient.findMany({
        select: { age: true },
      });

      const groups = {
        "0-10": 0,
        "11-20": 0,
        "21-30": 0,
        "31-40": 0,
        "41-50": 0,
        "51-60": 0,
        "61-70": 0,
        "71+": 0,
      };

      let totalAge = 0;

      patients.forEach((p) => {
        totalAge += p.age;

        if (p.age <= 10) groups["0-10"]++;
        else if (p.age <= 20) groups["11-20"]++;
        else if (p.age <= 30) groups["21-30"]++;
        else if (p.age <= 40) groups["31-40"]++;
        else if (p.age <= 50) groups["41-50"]++;
        else if (p.age <= 60) groups["51-60"]++;
        else if (p.age <= 70) groups["61-70"]++;
        else groups["71+"]++;
      });

      const averageAge =
        patients.length === 0
          ? 0
          : Number((totalAge / patients.length).toFixed(1));

      // determine which age group is the mode (highest count)
      let modeGroup = "";
      let highest = 0;

      for (const [key, value] of Object.entries(groups)) {
        if (value > highest) {
          highest = value;
          modeGroup = key;
        }
      }

      return {
        groups, // counts for chart
        averageAge, // bottom text
        modeGroup, // "Most: 31-40 yrs"
        modeCount: highest,
      };
    },
  });

/* ======================================================
   MONTHLY ADMISSION TREND
====================================================== */
export const getMonthlyAdmissionTrend = () =>
  withDashboardCache({
    key: "dashboard:monthly-admission-trend",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Create 12 months empty counters
      const monthlyCounts = Array(12).fill(0);

      // Fetch all current year admissions
      const admissions = await prisma.admission.findMany({
        where: {
          admissionDate: {
            gte: new Date(currentYear, 0, 1),
            lte: now,
          },
        },
        select: { admissionDate: true },
      });

      // Fill monthly counts
      admissions.forEach((record) => {
        const monthIndex = new Date(record.admissionDate).getMonth();
        monthlyCounts[monthIndex] += 1;
      });

      // Trim future months
      const trimmedCounts = monthlyCounts.slice(0, now.getMonth() + 1);

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].slice(0, trimmedCounts.length);

      // ----------------------------
      //  SIX-MONTH GROWTH CALCULATION
      // ----------------------------

      const currentStart = new Date(now);
      currentStart.setMonth(now.getMonth() - 5);

      const prevStart = new Date(now);
      prevStart.setMonth(now.getMonth() - 11);

      const prevEnd = new Date(now);
      prevEnd.setMonth(now.getMonth() - 6);

      const countAdmissions = async (from: Date, to: Date) => {
        return prisma.admission.count({
          where: {
            admissionDate: { gte: from, lte: to },
          },
        });
      };

      const current6 = await countAdmissions(currentStart, now);
      const previous6 = await countAdmissions(prevStart, prevEnd);

      const percentChange =
        previous6 === 0
          ? 0
          : Number((((current6 - previous6) / previous6) * 100).toFixed(2));

      return {
        months,
        counts: trimmedCounts,

        growth: {
          currentSixMonths: current6,
          previousSixMonths: previous6,
          percentChange,
        },
      };
    },
  });

/* ======================================================
   ADMISSION GENDER ANALYTICS
====================================================== */
export const getAdmissionGenderAnalytics = () =>
  withDashboardCache({
    key: "dashboard:admission-gender",
    ttlSeconds: 10 * 60,
    fetcher: async () => {
      // Count for all time admissions
      const totalAdmissions = await prisma.admission.count();

      // Count by gender
      const maleCount = await prisma.admission.count({
        where: { patientSex: "Male" },
      });

      const femaleCount = await prisma.admission.count({
        where: { patientSex: "Female" },
      });

      const otherCount = await prisma.admission.count({
        where: { patientSex: "Other" },
      });

      // Avoid division by zero
      const percent = (part: number) =>
        totalAdmissions === 0
          ? 0
          : Number(((part / totalAdmissions) * 100).toFixed(2));

      return {
        totalAdmissions,
        male: {
          count: maleCount,
          percentage: percent(maleCount),
        },
        female: {
          count: femaleCount,
          percentage: percent(femaleCount),
        },
        other: {
          count: otherCount,
          percentage: percent(otherCount),
        },
      };
    },
  });

/* ======================================================
   ADMISSION ANALYTICS
====================================================== */
export const getAdmissionAnalytics = () =>
  withDashboardCache({
    key: "dashboard:admissions",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const now = new Date();

      // --- TIME RANGES ---
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);

      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);

      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      // --- CURRENT MONTH RANGE ---
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // --- PREVIOUS MONTH RANGE ---
      const previousMonthStart = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Count admissions by date range
      const countAdmissions = async (from?: Date, to?: Date) => {
        const where: any = {};
        if (from || to) {
          where.admissionDate = {
            gte: from,
            lte: to || now,
          };
        }
        return prisma.admission.count({ where });
      };

      const percent = (curr: number, prev: number) => {
        if (!prev) return 0;
        return Number((((curr - prev) / prev) * 100).toFixed(2));
      };

      const total = await prisma.admission.count();

      const currentMonth = await countAdmissions(currentMonthStart);
      const previousMonth = await countAdmissions(
        previousMonthStart,
        previousMonthEnd
      );

      return {
        total,

        threeMonths: await countAdmissions(threeMonthsAgo),
        sixMonths: await countAdmissions(sixMonthsAgo),
        oneYear: await countAdmissions(oneYearAgo),

        currentMonth,
        previousMonth,

        percentChange: percent(currentMonth, previousMonth),
      };
    },
  });

/* ======================================================
   LEDGER FLOW SUMMARY
====================================================== */
export const getLedgerFlowSummary = () =>
  withDashboardCache({
    key: "dashboard:ledger-flow",
    ttlSeconds: 2 * 60, // 2 minutes cache since this involves financial data
    fetcher: async () => {
      // Helper function to calculate Money In & Out for a model
      const calcLedgerFlow = async (
        model: any,
        moneyInType: string,
        moneyOutType: string
      ) => {
        const moneyIn = await model.aggregate({
          _sum: { amount: true },
          where: { amountType: moneyInType },
        });

        const moneyOut = await model.aggregate({
          _sum: { amount: true },
          where: { amountType: moneyOutType },
        });

        const inAmount = Number(moneyIn._sum.amount || 0);
        const outAmount = Number(moneyOut._sum.amount || 0);

        return {
          moneyIn: inAmount,
          moneyOut: outAmount,
          netBalance: inAmount - outAmount,
        };
      };

      // Ledger calculations
      const patientLedger = await calcLedgerFlow(
        prisma.patientLedger,
        "Credit",
        "Debit"
      );

      const doctorLedger = await calcLedgerFlow(
        prisma.doctorLedger,
        "Credit",
        "Debit"
      );

      const bankLedger = await calcLedgerFlow(
        prisma.bankLedger,
        "Credit",
        "Debit"
      );

      const cashLedger = await calcLedgerFlow(
        prisma.cashLedger,
        "Income",
        "Expense"
      );

      // Totals
      const totalMoneyIn =
        patientLedger.moneyIn +
        doctorLedger.moneyIn +
        cashLedger.moneyIn +
        bankLedger.moneyIn;

      const totalMoneyOut =
        patientLedger.moneyOut +
        doctorLedger.moneyOut +
        cashLedger.moneyOut +
        bankLedger.moneyOut;

      return {
        ledgers: {
          patient: patientLedger,
          doctor: doctorLedger,
          cash: cashLedger,
          bank: bankLedger,
        },
        totals: {
          totalMoneyIn,
          totalMoneyOut,
          overallNetBalance: totalMoneyIn - totalMoneyOut,
        },
      };
    },
  });

/* ======================================================
   DASHBOARD STATS SUMMARY (All-in-one)
====================================================== */
export const getDashboardStatsSummary = () =>
  withDashboardCache({
    key: "dashboard:summary",
    ttlSeconds: 2 * 60, // 2 minutes cache for the combined dashboard
    fetcher: async () => {
      const [
        revenue,
        paymentModes,
        billStatus,
        monthlyBilling,
        billsByStatus,
        patients,
        ageDistribution,
        admissionTrend,
        admissionGender,
        admissions,
        ledgerFlow,
      ] = await Promise.all([
        getRevenueAnalytics(),
        getPaymentModeBreakdownAnalytics(),
        getBillStatusAnalytics(),
        getMonthlyBillingVsReceipt(),
        getBillsByStatusAnalytics(),
        getPatientAnalytics(),
        getPatientAgeDistribution(),
        getMonthlyAdmissionTrend(),
        getAdmissionGenderAnalytics(),
        getAdmissionAnalytics(),
        getLedgerFlowSummary(),
      ]);

      return {
        revenue,
        paymentModes,
        billStatus,
        monthlyBilling,
        billsByStatus,
        patients,
        ageDistribution,
        admissionTrend,
        admissionGender,
        admissions,
        ledgerFlow,
        timestamp: new Date().toISOString(),
      };
    },
  });
