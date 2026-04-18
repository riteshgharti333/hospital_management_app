import { prisma } from "../lib/prisma";
import { withDashboardCache } from "../utils/dashboardCache";

const format = (num: number) => Number(num.toFixed(2));

// Pre-compute date ranges once
const getDateRanges = (now: Date) => {
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  return {
    threeMonthsAgo,
    sixMonthsAgo,
    oneYearAgo,
    currentMonthStart,
    previousMonthStart,
    previousMonthEnd,
  };
};

/* ======================================================
   OPTIMIZED REVENUE ANALYTICS - 1 query instead of 6
====================================================== */
export const getRevenueAnalytics = () =>
  withDashboardCache({
    key: "dashboard:revenue",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const now = new Date();
      const ranges = getDateRanges(now);

      // SINGLE QUERY - all aggregations at once
      const result = await prisma.$queryRaw<
        {
          three_months: number;
          six_months: number;
          one_year: number;
          total: number;
          current_month: number;
          previous_month: number;
        }[]
      >`
        SELECT 
          COALESCE(SUM(CASE WHEN date >= ${ranges.threeMonthsAgo} THEN amount ELSE 0 END), 0) as three_months,
          COALESCE(SUM(CASE WHEN date >= ${ranges.sixMonthsAgo} THEN amount ELSE 0 END), 0) as six_months,
          COALESCE(SUM(CASE WHEN date >= ${ranges.oneYearAgo} THEN amount ELSE 0 END), 0) as one_year,
          COALESCE(SUM(amount), 0) as total,
          COALESCE(SUM(CASE WHEN date >= ${ranges.currentMonthStart} THEN amount ELSE 0 END), 0) as current_month,
          COALESCE(SUM(CASE WHEN date >= ${ranges.previousMonthStart} AND date < ${ranges.currentMonthStart} THEN amount ELSE 0 END), 0) as previous_month
        FROM "MoneyReceipt"
        WHERE date <= ${now}
      `;

      const data = result[0];
      const percentChange = data.previous_month
        ? format(
            ((data.current_month - data.previous_month) / data.previous_month) *
              100,
          )
        : 0;

      return {
        threeMonths: format(data.three_months),
        sixMonths: format(data.six_months),
        oneYear: format(data.one_year),
        total: format(data.total),
        currentMonth: format(data.current_month),
        previousMonth: format(data.previous_month),
        percentChange,
      };
    },
  });

/* ======================================================
   OPTIMIZED PAYMENT MODE BREAKDOWN - 1 query instead of 20
====================================================== */
export const getPaymentModeBreakdownAnalytics = () =>
  withDashboardCache({
    key: "dashboard:payment-mode-breakdown",
    ttlSeconds: 10 * 60,
    fetcher: async () => {
      const now = new Date();
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      const paymentModes = [
        "Online Transfer",
        "Card",
        "Cash",
        "Cheque",
        "Other",
      ];

      // SINGLE QUERY - all time periods at once
      const results = await prisma.$queryRaw<
        {
          period: string;
          payment_mode: string;
          total_amount: number;
        }[]
      >`
        SELECT 
          'all_time' as period,
          "paymentMode" as payment_mode,
          COALESCE(SUM(amount), 0) as total_amount
        FROM "MoneyReceipt"
        WHERE date <= ${now}
        GROUP BY "paymentMode"
        
        UNION ALL
        
        SELECT 
          'three_months' as period,
          "paymentMode" as payment_mode,
          COALESCE(SUM(amount), 0) as total_amount
        FROM "MoneyReceipt"
        WHERE date >= ${threeMonthsAgo} AND date <= ${now}
        GROUP BY "paymentMode"
        
        UNION ALL
        
        SELECT 
          'six_months' as period,
          "paymentMode" as payment_mode,
          COALESCE(SUM(amount), 0) as total_amount
        FROM "MoneyReceipt"
        WHERE date >= ${sixMonthsAgo} AND date <= ${now}
        GROUP BY "paymentMode"
        
        UNION ALL
        
        SELECT 
          'one_year' as period,
          "paymentMode" as payment_mode,
          COALESCE(SUM(amount), 0) as total_amount
        FROM "MoneyReceipt"
        WHERE date >= ${oneYearAgo} AND date <= ${now}
        GROUP BY "paymentMode"
      `;

      // Process results into required format
      const buildStats = (periodData: typeof results) => {
        const periodFiltered = periodData.filter(
          (r) => r.period === periodData[0]?.period,
        );
        const totalAmount = periodFiltered.reduce(
          (sum, r) => sum + Number(r.total_amount),
          0,
        );
        const amounts = paymentModes.map((mode) => {
          const found = periodFiltered.find((r) => r.payment_mode === mode);
          return found ? Number(found.total_amount) : 0;
        });
        const percentages = amounts.map((amt) =>
          totalAmount === 0
            ? 0
            : Number(((amt / totalAmount) * 100).toFixed(2)),
        );

        return {
          totalAmount: Number(totalAmount.toFixed(2)),
          paymentModes,
          amounts: amounts.map((a) => Number(a.toFixed(2))),
          percentages,
        };
      };

      return {
        allTime: buildStats(results.filter((r) => r.period === "all_time")),
        threeMonths: buildStats(
          results.filter((r) => r.period === "three_months"),
        ),
        sixMonths: buildStats(results.filter((r) => r.period === "six_months")),
        oneYear: buildStats(results.filter((r) => r.period === "one_year")),
      };
    },
  });

/* ======================================================
   OPTIMIZED BILL STATUS ANALYTICS - 1 query instead of 15
====================================================== */
export const getBillStatusAnalytics = () =>
  withDashboardCache({
    key: "dashboard:bill-status",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const now = new Date();
      const ranges = getDateRanges(now);
      const statuses = [
        "Pending",
        "PartiallyPaid",
        "Paid",
        "Cancelled",
        "Refunded",
      ];

      // SINGLE QUERY - all statuses and periods at once
      const results = await prisma.$queryRaw<
        {
          status: string;
          total: number;
          current_month: number;
          previous_month: number;
        }[]
      >`
        SELECT 
          status,
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE "billDate" >= ${ranges.currentMonthStart}) as current_month,
          COUNT(*) FILTER (WHERE "billDate" >= ${ranges.previousMonthStart} 
                          AND "billDate" <= ${ranges.previousMonthEnd}) as previous_month
        FROM "Bill"
        WHERE "billDate" <= ${now}
        GROUP BY status
      `;

      const result: any = {};
      const percent = (curr: number, prev: number) => {
        if (!prev) return 0;
        return Number((((curr - prev) / prev) * 100).toFixed(2));
      };

      for (const status of statuses) {
        const data = results.find((r) => r.status === status) || {
          total: 0,
          current_month: 0,
          previous_month: 0,
        };
        result[status] = Number(data.total);
        result[`${status}Curr`] = Number(data.current_month);
        result[`${status}Prev`] = Number(data.previous_month);
        result[`${status}Change`] = percent(
          Number(data.current_month),
          Number(data.previous_month),
        );
      }

      return result;
    },
  });

/* ======================================================
   OPTIMIZED MONTHLY BILLING VS RECEIPT - already efficient
====================================================== */
export const getMonthlyBillingVsReceipt = () =>
  withDashboardCache({
    key: "dashboard:monthly-billing-vs-receipt",
    ttlSeconds: 10 * 60,
    fetcher: async () => {
      const year = new Date().getFullYear();
      const format = (n: number) => Number(n.toFixed(2));

      // Parallel queries
      const [billingQuery, receiptQuery] = await Promise.all([
        prisma.$queryRaw<{ month: number; total: number }[]>`
          SELECT 
            EXTRACT(MONTH FROM b."createdAt") AS month,
            COALESCE(SUM(b."totalAmount"), 0) AS total
          FROM "BillItem" b
          WHERE EXTRACT(YEAR FROM b."createdAt") = ${year}
          GROUP BY month
          ORDER BY month ASC
        `,
        prisma.$queryRaw<{ month: number; total: number }[]>`
          SELECT 
            EXTRACT(MONTH FROM "date") AS month,
            COALESCE(SUM("amount"), 0) AS total
          FROM "MoneyReceipt"
          WHERE EXTRACT(YEAR FROM "date") = ${year}
          GROUP BY month
          ORDER BY month ASC
        `,
      ]);

      const billingMonthly = Array(12).fill(0);
      billingQuery.forEach((row) => {
        billingMonthly[row.month - 1] = format(Number(row.total));
      });

      const receiptMonthly = Array(12).fill(0);
      receiptQuery.forEach((row) => {
        receiptMonthly[row.month - 1] = format(Number(row.total));
      });

      return {
        year,
        billingMonthly,
        receiptMonthly,
        totalBilling: format(billingMonthly.reduce((a, b) => a + b, 0)),
        totalReceipt: format(receiptMonthly.reduce((a, b) => a + b, 0)),
      };
    },
  });

/* ======================================================
   OPTIMIZED BILLS BY STATUS ANALYTICS - 1 query instead of 20
====================================================== */
export const getBillsByStatusAnalytics = () =>
  withDashboardCache({
    key: "dashboard:bills-by-status",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const now = new Date();
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);

      const statuses = [
        "Pending",
        "PartiallyPaid",
        "Paid",
        "Cancelled",
        "Refunded",
      ];

      // SINGLE QUERY - all periods at once
      const results = await prisma.$queryRaw<
        {
          period: string;
          status: string;
          count: number;
          total_bills: number;
        }[]
      >`
        SELECT 'all_time' as period, status, COUNT(*) as count, SUM(COUNT(*)) OVER() as total_bills
        FROM "Bill"
        WHERE "createdAt" <= ${now}
        GROUP BY status
        
        UNION ALL
        
        SELECT 'three_months' as period, status, COUNT(*) as count, SUM(COUNT(*)) OVER() as total_bills
        FROM "Bill"
        WHERE "createdAt" >= ${threeMonthsAgo} AND "createdAt" <= ${now}
        GROUP BY status
        
        UNION ALL
        
        SELECT 'six_months' as period, status, COUNT(*) as count, SUM(COUNT(*)) OVER() as total_bills
        FROM "Bill"
        WHERE "createdAt" >= ${sixMonthsAgo} AND "createdAt" <= ${now}
        GROUP BY status
        
        UNION ALL
        
        SELECT 'one_year' as period, status, COUNT(*) as count, SUM(COUNT(*)) OVER() as total_bills
        FROM "Bill"
        WHERE "createdAt" >= ${oneYearAgo} AND "createdAt" <= ${now}
        GROUP BY status
      `;

      const buildStatusStats = (period: string) => {
        const periodData = results.filter((r) => r.period === period);
        const totalBills = periodData[0]?.total_bills || 0;
        const counts = statuses.map((status) => {
          const found = periodData.find((r) => r.status === status);
          return found ? Number(found.count) : 0;
        });
        const percentages = counts.map((count) =>
          totalBills === 0
            ? 0
            : Number(((count / totalBills) * 100).toFixed(2)),
        );

        return {
          totalBills: Number(totalBills),
          statuses,
          counts,
          percentages,
        };
      };

      return {
        allTime: buildStatusStats("all_time"),
        threeMonths: buildStatusStats("three_months"),
        sixMonths: buildStatusStats("six_months"),
        oneYear: buildStatusStats("one_year"),
      };
    },
  });

/* ======================================================
   OPTIMIZED PATIENT ANALYTICS - 1 query instead of 7
====================================================== */
export const getPatientAnalytics = () =>
  withDashboardCache({
    key: "dashboard:patients",
    ttlSeconds: 10 * 60,
    fetcher: async () => {
      const now = new Date();
      const ranges = getDateRanges(now);

      // SINGLE QUERY - all counts at once
      const result = await prisma.$queryRaw<
        {
          total: number;
          three_months: number;
          six_months: number;
          one_year: number;
          current_month: number;
          previous_month: number;
        }[]
      >`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE "createdAt" >= ${ranges.threeMonthsAgo}) as three_months,
          COUNT(*) FILTER (WHERE "createdAt" >= ${ranges.sixMonthsAgo}) as six_months,
          COUNT(*) FILTER (WHERE "createdAt" >= ${ranges.oneYearAgo}) as one_year,
          COUNT(*) FILTER (WHERE "createdAt" >= ${ranges.currentMonthStart}) as current_month,
          COUNT(*) FILTER (WHERE "createdAt" >= ${ranges.previousMonthStart} 
                          AND "createdAt" <= ${ranges.previousMonthEnd}) as previous_month
        FROM "Patient"
        WHERE "createdAt" <= ${now}
      `;

      const data = result[0];
      const percent = (curr: number, prev: number) => {
        if (!prev) return 0;
        return Number((((curr - prev) / prev) * 100).toFixed(2));
      };

      return {
        total: Number(data.total),
        threeMonths: Number(data.three_months),
        sixMonths: Number(data.six_months),
        oneYear: Number(data.one_year),
        currentMonth: Number(data.current_month),
        previousMonth: Number(data.previous_month),
        percentChange: percent(
          Number(data.current_month),
          Number(data.previous_month),
        ),
      };
    },
  });

/* ======================================================
   OPTIMIZED PATIENT AGE DISTRIBUTION - already efficient
====================================================== */
export const getPatientAgeDistribution = () =>
  withDashboardCache({
    key: "dashboard:patient-age-distribution",
    ttlSeconds: 30 * 60,
    fetcher: async () => {
      // Use raw SQL for age calculation (much faster)
      const result = await prisma.$queryRaw<
        {
          age_group: string;
          count: number;
          avg_age: number;
        }[]
      >`
        WITH ages AS (
          SELECT 
            EXTRACT(YEAR FROM age(CURRENT_DATE, "dateOfBirth")) as age
          FROM "Patient"
          WHERE "dateOfBirth" IS NOT NULL
        )
        SELECT 
          CASE 
            WHEN age <= 10 THEN '0-10'
            WHEN age <= 20 THEN '11-20'
            WHEN age <= 30 THEN '21-30'
            WHEN age <= 40 THEN '31-40'
            WHEN age <= 50 THEN '41-50'
            WHEN age <= 60 THEN '51-60'
            WHEN age <= 70 THEN '61-70'
            ELSE '71+'
          END as age_group,
          COUNT(*) as count,
          ROUND(AVG(age), 1) as avg_age
        FROM ages
        GROUP BY age_group
      `;

      const groups: Record<
        | "0-10"
        | "11-20"
        | "21-30"
        | "31-40"
        | "41-50"
        | "51-60"
        | "61-70"
        | "71+",
        number
      > = {
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
      let totalPatients = 0;

      for (const row of result) {
        groups[row.age_group as keyof typeof groups] = Number(row.count);
        totalAge += Number(row.avg_age) * Number(row.count);
        totalPatients += Number(row.count);
      }

      const averageAge =
        totalPatients === 0 ? 0 : Number((totalAge / totalPatients).toFixed(1));

      let modeGroup = "";
      let highest = 0;
      for (const [key, value] of Object.entries(groups)) {
        if (value > highest) {
          highest = value;
          modeGroup = key;
        }
      }

      return { groups, averageAge, modeGroup, modeCount: highest };
    },
  });

/* ======================================================
   OPTIMIZED MONTHLY ADMISSION TREND - 2 queries instead of many
====================================================== */
export const getMonthlyAdmissionTrend = () =>
  withDashboardCache({
    key: "dashboard:monthly-admission-trend",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // SINGLE QUERY for monthly counts and growth
      const result = await prisma.$queryRaw<
        {
          month_index: number;
          count: number;
          current_6_months: number;
          previous_6_months: number;
        }[]
      >`
        WITH monthly_counts AS (
          SELECT 
            EXTRACT(MONTH FROM "admissionDate") - 1 as month_index,
            COUNT(*) as count
          FROM "Admission"
          WHERE EXTRACT(YEAR FROM "admissionDate") = ${currentYear}
            AND "admissionDate" <= ${now}
          GROUP BY EXTRACT(MONTH FROM "admissionDate")
        ),
        growth_calc AS (
          SELECT 
            COUNT(*) FILTER (WHERE "admissionDate" >= ${new Date(now.getFullYear(), now.getMonth() - 5, now.getDate())}) as current_6,
            COUNT(*) FILTER (WHERE "admissionDate" >= ${new Date(now.getFullYear(), now.getMonth() - 11, now.getDate())}
                            AND "admissionDate" < ${new Date(now.getFullYear(), now.getMonth() - 5, now.getDate())}) as previous_6
          FROM "Admission"
          WHERE "admissionDate" <= ${now}
        )
        SELECT 
          mc.month_index,
          mc.count,
          gc.current_6 as current_6_months,
          gc.previous_6 as previous_6_months
        FROM monthly_counts mc
        CROSS JOIN growth_calc gc
      `;

      const monthlyCounts = Array(12).fill(0);
      let current6 = 0,
        previous6 = 0;

      for (const row of result) {
        if (row.month_index !== null) {
          monthlyCounts[row.month_index] = Number(row.count);
        }
        current6 = Number(row.current_6_months);
        previous6 = Number(row.previous_6_months);
      }

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
   OPTIMIZED ADMISSION GENDER ANALYTICS - 1 query instead of 4
====================================================== */
export const getAdmissionGenderAnalytics = () =>
  withDashboardCache({
    key: "dashboard:admission-gender",
    ttlSeconds: 10 * 60,
    fetcher: async () => {
      // SINGLE QUERY with JOIN
      const result = await prisma.$queryRaw<
        {
          gender: string;
          count: number;
          total: number;
        }[]
      >`
        SELECT 
          p.gender,
          COUNT(*) as count,
          SUM(COUNT(*)) OVER() as total
        FROM "Admission" a
        INNER JOIN "Patient" p ON a."patientId" = p.id
        GROUP BY p.gender
      `;

      const getCount = (gender: string) => {
        const found = result.find((r) => r.gender === gender);
        return found ? Number(found.count) : 0;
      };

      const totalAdmissions = result[0]?.total || 0;
      const percent = (count: number) =>
        totalAdmissions === 0
          ? 0
          : Number(((count / totalAdmissions) * 100).toFixed(2));

      const maleCount = getCount("Male");
      const femaleCount = getCount("Female");
      const otherCount = getCount("Other");

      return {
        totalAdmissions: Number(totalAdmissions),
        male: { count: maleCount, percentage: percent(maleCount) },
        female: { count: femaleCount, percentage: percent(femaleCount) },
        other: { count: otherCount, percentage: percent(otherCount) },
      };
    },
  });

/* ======================================================
   OPTIMIZED ADMISSION ANALYTICS - 1 query instead of 7
====================================================== */
export const getAdmissionAnalytics = () =>
  withDashboardCache({
    key: "dashboard:admissions",
    ttlSeconds: 5 * 60,
    fetcher: async () => {
      const now = new Date();
      const ranges = getDateRanges(now);

      // SINGLE QUERY - all counts at once
      const result = await prisma.$queryRaw<
        {
          total: number;
          three_months: number;
          six_months: number;
          one_year: number;
          current_month: number;
          previous_month: number;
        }[]
      >`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE "admissionDate" >= ${ranges.threeMonthsAgo}) as three_months,
          COUNT(*) FILTER (WHERE "admissionDate" >= ${ranges.sixMonthsAgo}) as six_months,
          COUNT(*) FILTER (WHERE "admissionDate" >= ${ranges.oneYearAgo}) as one_year,
          COUNT(*) FILTER (WHERE "admissionDate" >= ${ranges.currentMonthStart}) as current_month,
          COUNT(*) FILTER (WHERE "admissionDate" >= ${ranges.previousMonthStart} 
                          AND "admissionDate" <= ${ranges.previousMonthEnd}) as previous_month
        FROM "Admission"
        WHERE "admissionDate" <= ${now}
      `;

      const data = result[0];
      const percent = (curr: number, prev: number) => {
        if (!prev) return 0;
        return Number((((curr - prev) / prev) * 100).toFixed(2));
      };

      return {
        total: Number(data.total),
        threeMonths: Number(data.three_months),
        sixMonths: Number(data.six_months),
        oneYear: Number(data.one_year),
        currentMonth: Number(data.current_month),
        previousMonth: Number(data.previous_month),
        percentChange: percent(
          Number(data.current_month),
          Number(data.previous_month),
        ),
      };
    },
  });

/* ======================================================
   OPTIMIZED LEDGER FLOW SUMMARY - Parallel queries
====================================================== */
export const getLedgerFlowSummary = () =>
  withDashboardCache({
    key: "dashboard:ledger-flow",
    ttlSeconds: 2 * 60,
    fetcher: async () => {
      // Execute all aggregations in parallel
      const [
        patientCredit,
        patientDebit,
        doctorCredit,
        doctorDebit,
        bankCredit,
        bankDebit,
        cashIncome,
        cashExpense,
      ] = await Promise.all([
        prisma.patientLedger.aggregate({
          _sum: { amount: true },
          where: { amountType: "CREDIT" },
        }),
        prisma.patientLedger.aggregate({
          _sum: { amount: true },
          where: { amountType: "DEBIT" },
        }),
        prisma.doctorLedger.aggregate({
          _sum: { amount: true },
          where: { amountType: "CREDIT" },
        }),
        prisma.doctorLedger.aggregate({
          _sum: { amount: true },
          where: { amountType: "DEBIT" },
        }),
        prisma.bankLedger.aggregate({
          _sum: { amount: true },
          where: { amountType: "CREDIT" },
        }),
        prisma.bankLedger.aggregate({
          _sum: { amount: true },
          where: { amountType: "DEBIT" },
        }),
        prisma.cashLedger.aggregate({
          _sum: { amount: true },
          where: { amountType: "INCOME" },
        }),
        prisma.cashLedger.aggregate({
          _sum: { amount: true },
          where: { amountType: "EXPENSE" },
        }),
      ]);

      const patientLedger = {
        moneyIn: Number(patientCredit._sum.amount || 0),
        moneyOut: Number(patientDebit._sum.amount || 0),
        netBalance:
          Number(patientCredit._sum.amount || 0) -
          Number(patientDebit._sum.amount || 0),
      };

      const doctorLedger = {
        moneyIn: Number(doctorCredit._sum.amount || 0),
        moneyOut: Number(doctorDebit._sum.amount || 0),
        netBalance:
          Number(doctorCredit._sum.amount || 0) -
          Number(doctorDebit._sum.amount || 0),
      };

      const bankLedger = {
        moneyIn: Number(bankCredit._sum.amount || 0),
        moneyOut: Number(bankDebit._sum.amount || 0),
        netBalance:
          Number(bankCredit._sum.amount || 0) -
          Number(bankDebit._sum.amount || 0),
      };

      const cashLedger = {
        moneyIn: Number(cashIncome._sum.amount || 0),
        moneyOut: Number(cashExpense._sum.amount || 0),
        netBalance:
          Number(cashIncome._sum.amount || 0) -
          Number(cashExpense._sum.amount || 0),
      };

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
   OPTIMIZED DASHBOARD STATS SUMMARY - Already parallel!
====================================================== */
export const getDashboardStatsSummary = () =>
  withDashboardCache({
    key: "dashboard:summary",
    ttlSeconds: 2 * 60,
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
