// src/components/GlobalSearch/searchData.js

export const searchItems = [
  // -------- Profile & General --------
  {
    title: "Profile",
    path: "/profile",
    category: "General",
  },
  {
    title: "Dashboard",
    path: "/dashboard",
    category: "General",
  },

  // -------- Admissions --------
  {
    title: "Admission Entries",
    path: "/admission-entries",
    category: "Admissions",
  },
  {
    title: "New Admission Entry",
    path: "/new-admission-entry",
    category: "Admissions",
  },

  // -------- Birth Register --------
  {
    title: "Birth Entries",
    path: "/birth-entries",
    category: "Birth Register",
  },
  {
    title: "New Birth Register",
    path: "/new-birth-register",
    category: "Birth Register",
  },

  // -------- Patients --------
  {
    title: "Patients Entries",
    path: "/patients-entries",
    category: "Patients",
  },
  {
    title: "New Patient Register",
    path: "/new-patient-register",
    category: "Patients",
  },

  // -------- Departments --------
  {
    title: "Departments",
    path: "/departments",
    category: "Departments",
  },
  {
    title: "New Department",
    path: "/new-department",
    category: "Departments",
  },

  // -------- Appointments --------
  {
    title: "Appointments",
    path: "/appointments",
    category: "Appointments",
  },
  {
    title: "New Appointment",
    path: "/new-appointment",
    category: "Appointments",
  },

  // -------- Nurses --------
  {
    title: "Nurses",
    path: "/nurses",
    category: "Nurses",
  },
  {
    title: "New Nurse",
    path: "/new-nurse",
    category: "Nurses",
  },

  // -------- Doctors --------
  {
    title: "Doctors",
    path: "/doctors",
    category: "Doctors",
  },
  {
    title: "New Doctor",
    path: "/new-doctor",
    category: "Doctors",
  },

  // -------- Prescriptions --------
  {
    title: "Prescriptions",
    path: "/prescriptions",
    category: "Prescriptions",
  },
  {
    title: "New Prescription",
    path: "/new-prescription",
    category: "Prescriptions",
  },

  // -------- Bank --------
  {
    title: "Bank",
    path: "/bank",
    category: "Bank",
  },
  {
    title: "New Bank",
    path: "/new-bank",
    category: "Bank",
  },

  // -------- Cash --------
  {
    title: "Cash",
    path: "/cash",
    category: "Cash",
  },
  {
    title: "New Cash",
    path: "/new-cash",
    category: "Cash",
  },

  // -------- Ledger --------
  {
    title: "New Ledger",
    path: "/new-ledger",
    category: "Ledger",
  },
  {
    title: "Patient Ledger",
    path: "/ledger/patient-ledger",
    category: "Ledger",
  },
  {
    title: "Doctor Ledger",
    path: "/ledger/doctor-ledger",
    category: "Ledger",
  },
  {
    title: "Cash Ledger",
    path: "/ledger/cash-ledger",
    category: "Ledger",
  },
  {
    title: "Bank Ledger",
    path: "/ledger/bank-ledger",
    category: "Ledger",
  },

  // -------- Billing --------
  {
    title: "Bills",
    path: "/bills",
    category: "Billing",
  },
  {
    title: "New Bill Entry",
    path: "/new-bill-entry",
    category: "Billing",
  },

  // -------- Money Receipts --------
  {
    title: "Money Receipts",
    path: "/money-receipts",
    category: "Billing",
  },
  {
    title: "New Money Receipt Entry",
    path: "/new-money-receipt-entry",
    category: "Billing",
  },

  // -------- Permissions (Admin Only) --------
  {
    title: "Permissions",
    path: "/permissions",
    category: "Admin",
  },

  // -------- Help Pages --------
  {
    title: "Privacy Policy",
    path: "/privacy-policy",
    category: "Help",
  },
  {
    title: "Terms & Conditions",
    path: "/terms-&-conditions",
    category: "Help",
  },
  {
    title: "Help Center",
    path: "/help-center",
    category: "Help",
  },
];

// Simplified version for quick search
export const GLOBAL_SEARCH_PAGES = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Profile", path: "/profile" },
  
  // Admissions
  { title: "Admission Entries", path: "/admission-entries" },
  { title: "New Admission Entry", path: "/new-admission-entry" },
  
  // Birth
  { title: "Birth Entries", path: "/birth-entries" },
  { title: "New Birth Register", path: "/new-birth-register" },
  
  // Patients
  { title: "Patients Entries", path: "/patients-entries" },
  { title: "New Patient Register", path: "/new-patient-register" },
  
  // Departments
  { title: "Departments", path: "/departments" },
  { title: "New Department", path: "/new-department" },
  
  // Appointments
  { title: "Appointments", path: "/appointments" },
  { title: "New Appointment", path: "/new-appointment" },
  
  // Nurses
  { title: "Nurses", path: "/nurses" },
  { title: "New Nurse", path: "/new-nurse" },
  
  // Doctors
  { title: "Doctors", path: "/doctors" },
  { title: "New Doctor", path: "/new-doctor" },
  
  // Prescriptions
  { title: "Prescriptions", path: "/prescriptions" },
  { title: "New Prescription", path: "/new-prescription" },
  
  // Bank
  { title: "Bank", path: "/bank" },
  { title: "New Bank", path: "/new-bank" },
  
  // Cash
  { title: "Cash", path: "/cash" },
  { title: "New Cash", path: "/new-cash" },
  
  // Ledger
  { title: "New Ledger", path: "/new-ledger" },
  { title: "Patient Ledger", path: "/ledger/patient-ledger" },
  { title: "Doctor Ledger", path: "/ledger/doctor-ledger" },
  { title: "Cash Ledger", path: "/ledger/cash-ledger" },
  { title: "Bank Ledger", path: "/ledger/bank-ledger" },
  
  // Billing
  { title: "Bills", path: "/bills" },
  { title: "New Bill Entry", path: "/new-bill-entry" },
  
  // Money Receipt
  { title: "Money Receipts", path: "/money-receipts" },
  { title: "New Money Receipt Entry", path: "/new-money-receipt-entry" },
  
  // Admin
  { title: "Permissions", path: "/permissions" },
  
  // Help
  // { title: "Privacy Policy", path: "/privacy-policy" },
  // { title: "Terms & Conditions", path: "/terms-&-conditions" },
  // { title: "Help Center", path: "/help-center" },
];

// Optional: Helper function to search by query
export const searchRoutes = (query) => {
  if (!query || query.trim() === "") return [];
  
  const lowerQuery = query.toLowerCase();
  return GLOBAL_SEARCH_PAGES.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.path.toLowerCase().includes(lowerQuery)
  );
};

// Optional: Get category for a path
export const getCategoryByPath = (path) => {
  const item = searchItems.find(item => item.path === path);
  return item ? item.category : "General";
};