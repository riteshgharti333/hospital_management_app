// src/modules/ai/utils/questionBank.ts

export const ADMISSION_QUESTIONS = {
  // Total Counts
  totalAdmissions: [
    "how many admissions today?",
    "total admissions today",
    "total patients admitted today",
    "number of admissions today",
    "how many patients today?",
    "today's admission count",
    "admission count today",
    "total admitted patients today",
    "how many patients admitted so far?",
    "count of admissions today",
  ],

  // Gender Based
  maleAdmissions: [
    "how many male patients admitted today?",
    "total male admissions today",
    "male patients today",
    "number of male patients admitted",
    "how many men admitted today?",
    "male admission count",
    "total male patients",
  ],

  femaleAdmissions: [
    "how many female patients admitted today?",
    "total female admissions today",
    "female patients today",
    "number of female patients admitted",
    "how many women admitted today?",
    "female admission count",
    "total female patients",
  ],

  // Doctor Based
  doctorAdmissions: [
    "how many patients under Dr. {name}?",
    "patients admitted by Dr. {name}",
    "Dr. {name} admissions today",
    "how many admissions under Dr. {name}?",
    "total patients of Dr. {name}",
  ],

  // Date Based
  yesterdayAdmissions: [
    "how many admissions yesterday?",
    "total admissions yesterday",
    "yesterday's admission count",
    "patients admitted yesterday",
  ],

  weeklyAdmissions: [
    "admissions this week",
    "how many patients this week?",
    "weekly admission count",
    "total admissions this week",
  ],

  monthlyAdmissions: [
    "admissions this month",
    "how many patients this month?",
    "monthly admission count",
    "total admissions this month",
  ],

  // Status Based
  activeAdmissions: [
    "how many patients currently admitted?",
    "active admissions",
    "current inpatients",
    "patients still in hospital",
    "how many patients not discharged?",
    "currently admitted patients",
  ],

  dischargedToday: [
    "how many patients discharged today?",
    "today's discharges",
    "patients discharged today",
    "discharge count today",
  ],

  // Comparative
  compareAdmissions: [
    "compare today vs yesterday admissions",
    "admissions today vs yesterday",
    "today admissions compared to yesterday",
  ],

  // Department/Specialty (if you have this data)
  departmentAdmissions: [
    "admissions by department",
    "which department has most admissions?",
    "department wise admissions",
  ],
};

export const ALL_POSSIBLE_QUESTIONS = [
  ...ADMISSION_QUESTIONS.totalAdmissions,
  ...ADMISSION_QUESTIONS.maleAdmissions,
  ...ADMISSION_QUESTIONS.femaleAdmissions,
  ...ADMISSION_QUESTIONS.doctorAdmissions,
  ...ADMISSION_QUESTIONS.yesterdayAdmissions,
  ...ADMISSION_QUESTIONS.weeklyAdmissions,
  ...ADMISSION_QUESTIONS.monthlyAdmissions,
  ...ADMISSION_QUESTIONS.activeAdmissions,
  ...ADMISSION_QUESTIONS.dischargedToday,
  ...ADMISSION_QUESTIONS.compareAdmissions,
];