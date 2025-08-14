// services/modelConfig.ts
export const MODEL_CONFIG = {
  // Patient-related models
  admission: { cursorField: "id", defaultLimit: 100, cacheExpiry: 600 },
  birth: { cursorField: "createdAt", defaultLimit: 50, cacheExpiry: 600 },
  patient: { cursorField: "id", defaultLimit: 100, cacheExpiry: 600 },
  prescription: { cursorField: "prescriptionDate", defaultLimit: 50, cacheExpiry: 300 },
  medicine: { cursorField: "id", defaultLimit: 200, cacheExpiry: 300 },

  // Staff models
  doctor: { cursorField: "id", defaultLimit: 50, cacheExpiry: 600 },
  nurse: { cursorField: "id", defaultLimit: 50, cacheExpiry: 600 },
  pharmacist: { cursorField: "id", defaultLimit: 50, cacheExpiry: 600 },
  employee: { cursorField: "id", defaultLimit: 50, cacheExpiry: 600 },

  // Facility models
  bed: { cursorField: "bedNumber", defaultLimit: 100, cacheExpiry: 600 },
  bedAssignment: { cursorField: "allocateDate", defaultLimit: 100, cacheExpiry: 300 },
  department: { cursorField: "id", defaultLimit: 50, cacheExpiry: 3600 },
  ambulance: { cursorField: "id", defaultLimit: 30, cacheExpiry: 600 },

  // Transaction models
  bill: { cursorField: "billDate", defaultLimit: 50, cacheExpiry: 300 },
  billItem: { cursorField: "id", defaultLimit: 100, cacheExpiry: 300 },
  voucher: { cursorField: "voucherDate", defaultLimit: 50, cacheExpiry: 300 },
  moneyReceipt: { cursorField: "date", defaultLimit: 50, cacheExpiry: 300 },

  // Ledger models (shorter cache due to frequent updates)
  patientLedger: { cursorField: "date", defaultLimit: 100, cacheExpiry: 60 },
  bankLedger: { cursorField: "date", defaultLimit: 100, cacheExpiry: 60 },
  cashLedger: { cursorField: "date", defaultLimit: 100, cacheExpiry: 60 },
  // ... add all other models ...
} as const;

export type ModelName = keyof typeof MODEL_CONFIG;