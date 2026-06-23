import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

/// LAYOUT
import Layout from "./components/Layout/Layout";

/// AUTHENTICATION PAGES
import Login from "./pages/Auth/Login";
import Profile from "./pages/Auth/Profile";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminAccessManagement from "./pages/Auth/AdminAccessManagement";

/// HELP PAGES
import Policy from "./pages/HelpPage/Policy";
import Terms from "./pages/HelpPage/Terms";
import Help from "./pages/HelpPage/Help";

/// DASHBOARD
import Dashboard from "./pages/Service/Dashboard";

/// ADMISSION > ALL ADMISSION ROUTES
import NewAdmission from "./pages/Service/NewAdmission";
import AdmissionTable from "./pages/TableData/AdmissionTable";
import EditAdmission from "./pages/UpdateData/EditAdmission";

/// BIRTH > ALL BIRTH ROUTES
import BirthRegister from "./pages/Service/BirthRegister";
import BirthTable from "./pages/TableData/BirthTable";
import EditBirth from "./pages/UpdateData/EditBirth";

/// PATIENT > ALL PATIENT ROUTES
import NewPatient from "./pages/Service/NewPatient";
import PatientsTable from "./pages/TableData/PatientsTable";
import EditPatients from "./pages/UpdateData/EditPatients";

/// DEPARTMENT > ALL DEPARTMENT ROUTES
import NewDepartment from "./pages/Service/NewDepartment";
import DepartmentTable from "./pages/TableData/DepartmentTable";
import EditDepartment from "./pages/UpdateData/EditDepartment";

/// APPOINTMENT > ALL APPOINTMENT ROUTES
import NewAppointment from "./pages/Service/NewAppointment";
import AppointmentTable from "./pages/TableData/AppointmentTable";
import EditAppointment from "./pages/UpdateData/EditAppointment";

/// NURSE > ALL NURSE ROUTES
import NewNurse from "./pages/Service/NewNurse";
import NurseTable from "./pages/TableData/NurseTable";
import EditNurse from "./pages/UpdateData/EditNurse";

/// DOCTOR > ALL DOCTOR ROUTES
import NewDoctor from "./pages/Service/NewDoctor";
import DoctorTable from "./pages/TableData/DoctorTable";
import EditDocter from "./pages/UpdateData/EditDocter";

/// PRESCRIPTION > ALL PRESCRIPTION ROUTES
import NewPrescription from "./pages/Service/NewPrescription";
import PrescriptionTable from "./pages/TableData/PrescriptionTable";
import EditPrescription from "./pages/UpdateData/EditPrescription";

/// BANK > ALL BANK ROUTES
import NewBank from "./pages/Service/NewBank";
import BankTable from "./pages/TableData/BankTable";
import EditBank from "./pages/UpdateData/EditBank";

/// CASH > ALL CASH ROUTES
import NewCash from "./pages/Service/NewCash";
import CashTable from "./pages/TableData/CashTable";
import EditCash from "./pages/UpdateData/EditCash";

/// LEDGER > ALL LEDGER ROUTES
import NewLedger from "./pages/Service/NewLedger";
import EditLedger from "./pages/UpdateData/EditLedger";
import PatientLedger from "./pages/LadgerTable/PatientLedger";
import DoctorLedger from "./pages/LadgerTable/DoctorLedger";
import CashLedger from "./pages/LadgerTable/CashLedger";
import BankLedger from "./pages/LadgerTable/BankLedger";

/// TRANSACTION > ALL TRANSACTION ROUTES
import NewBill from "./pages/Service/NewBill";
import NewMoneyReceiptEntry from "./pages/Service/NewMoneyReceiptEntry";
import BillTable from "./pages/TableData/BillTable";
import MoneyReceiptTable from "./pages/TableData/MoneyReceiptTable";
import EditBill from "./pages/UpdateData/EditBill";
import EditMoneyReceipt from "./pages/UpdateData/EditMoneyReceipt";

/// UTILITIES
import NetworkProvider from "./utils/NetworkProvider";
import RequireRole from "./utils/RequireRole";
import { initToastConfig } from "./utils/toastConfig";
import LandingPage from "./pages/LandingPage/LandingPage";
import MediAI from "./ai-medicare/MediAI";

/// ============================================
/// MAIN APP COMPONENT
/// ============================================

function App() {
  initToastConfig();
  return (
    <div className="app">
      <NetworkProvider>
        <BrowserRouter>
          <Routes>
            /// LANDING PAGE
            <Route path="/" element={<LandingPage />} />
            <Route path="/medi-care" element={<LandingPage />} />
            /// AUTH ROUTES
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            /// HELP ROUTES
            <Route path="/privacy-policy" element={<Policy />} />
            <Route path="/terms-&-conditions" element={<Terms />} />
            <Route path="/help-center" element={<Help />} />
            /// PROTECTED ROUTES WITH LAYOUT
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              /// ADMIN ONLY ROUTES
              <Route
                path="/permissions"
                element={
                  <RequireRole allowedRoles={["ADMIN"]}>
                    <AdminAccessManagement />
                  </RequireRole>
                }
              />
              /// ADMISSION ROUTES
              <Route path="/admission-entries" element={<AdmissionTable />} />
              <Route path="/new-admission-entry" element={<NewAdmission />} />
              <Route path="/admission/:id" element={<EditAdmission />} />
              /// BIRTH ROUTES
              <Route path="/birth-entries" element={<BirthTable />} />
              <Route path="/new-birth-register" element={<BirthRegister />} />
              <Route path="/birth/:id" element={<EditBirth />} />
              /// PATIENT ROUTES
              <Route path="/patients-entries" element={<PatientsTable />} />
              <Route path="/new-patient-register" element={<NewPatient />} />
              <Route path="/patient/:id" element={<EditPatients />} />
              /// DEPARTMENT ROUTES
              <Route path="/departments" element={<DepartmentTable />} />
              <Route path="/new-department" element={<NewDepartment />} />
              <Route path="/department/:id" element={<EditDepartment />} />
              /// APPOINTMENT ROUTES
              <Route path="/appointments" element={<AppointmentTable />} />
              <Route path="/new-appointment" element={<NewAppointment />} />
              <Route path="/appointment/:id" element={<EditAppointment />} />
              /// NURSE ROUTES
              <Route path="/nurses" element={<NurseTable />} />
              <Route path="/new-nurse" element={<NewNurse />} />
              <Route path="/nurse/:id" element={<EditNurse />} />
              /// DOCTOR ROUTES
              <Route path="/doctors" element={<DoctorTable />} />
              <Route path="/new-doctor" element={<NewDoctor />} />
              <Route path="/doctor/:id" element={<EditDocter />} />
              /// PRESCRIPTION ROUTES
              <Route path="/prescriptions" element={<PrescriptionTable />} />
              <Route path="/new-prescription" element={<NewPrescription />} />
              <Route path="/prescription/:id" element={<EditPrescription />} />
              /// BANK ROUTES
              <Route path="/bank" element={<BankTable />} />
              <Route path="/new-bank" element={<NewBank />} />
              <Route path="/bank/:id" element={<EditBank />} />
              /// CASH ROUTES
              <Route path="/cash" element={<CashTable />} />
              <Route path="/new-cash" element={<NewCash />} />
              <Route path="/cash/:id" element={<EditCash />} />
              /// LEDGER ROUTES
              <Route path="/new-ledger" element={<NewLedger />} />
              <Route path="/ledger/:ledgerName/:id" element={<EditLedger />} />
              <Route
                path="/ledger/patient-ledger"
                element={<PatientLedger />}
              />
              <Route path="/ledger/doctor-ledger" element={<DoctorLedger />} />
              <Route path="/ledger/cash-ledger" element={<CashLedger />} />
              <Route path="/ledger/bank-ledger" element={<BankLedger />} />
              /// TRANSACTION ROUTES
              <Route path="/bills" element={<BillTable />} />
              <Route path="/new-bill-entry" element={<NewBill />} />
              <Route path="/bill/:id" element={<EditBill />} />
              <Route path="/money-receipts" element={<MoneyReceiptTable />} />
              <Route
                path="/new-money-receipt-entry"
                element={<NewMoneyReceiptEntry />}
              />
              <Route path="/money-receipt/:id" element={<EditMoneyReceipt />} />
              /// REPORT ROUTES
              {/* <Route path="/purchase-report" element={<PurchaseReportTable />} />
              <Route path="/provisional-invoice-report" element={<ProvisionalTable />} />
              <Route path="/invoice/:id" element={<ViewInvoiceTable />} />
              <Route path="/due-lists" element={<DueTable />} />
              <Route path="/payment-detail/:id" element={<PaymentDetailsTable />} />
              <Route path="/view-money-receipts" element={<ViewReceiptTable />} />
              <Route path="/discharge-lists" element={<DischargeTable />} /> */}
            </Route>
          </Routes>
        </BrowserRouter>
      </NetworkProvider>
    </div>
  );
}

export default App;
