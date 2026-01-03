import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import AdmissionEntry from "./pages/Service/AdmissionEntry";
import Dashboard from "./pages/Service/Dashboard";
import BirthRegister from "./pages/Service/BirthRegister";
import PatientRegister from "./pages/Service/PatientRegister";
import AddmissionEntriesTable from "./pages/TableData/AddmissionEntriesTable";
import BirthEntriesTable from "./pages/TableData/BirthEntriesTable";
import PatientsEntriesTable from "./pages/TableData/PatientsEntriesTable";
import DepartmentTable from "./pages/TableData/DepartmentTable";
import NewDepartment from "./pages/Service/NewDepartment";

import AppointmentTable from "./pages/TableData/AppointmentTable";
import NewAppointment from "./pages/Service/NewAppointment";
import NurseTable from "./pages/TableData/NurseTable";
import NewNurse from "./pages/Service/NewNurse";
import DoctorTable from "./pages/TableData/DoctorTable";
import NewDoctor from "./pages/Service/NewDoctor";
import PrescriptionTable from "./pages/TableData/PrescriptionTable";
import NewPrescription from "./pages/Service/NewPrescription";

import NewLedger from "./pages/Service/NewLedger";
import PatientLedger from "./pages/LadgerTable/PatientLedger";
import DoctorLedger from "./pages/LadgerTable/DoctorLedger";

import CashLedger from "./pages/LadgerTable/CashLedger";
import BankLedger from "./pages/LadgerTable/BankLedger";

import NewBillEntry from "./pages/Service/NewBillEntry";
import NewMoneyReceiptEntry from "./pages/Service/NewMoneyReceiptEntry";
import BillTable from "./pages/TableData/BillTable";
import MoneyReceiptTable from "./pages/TableData/MoneyReceiptTable";

import PurchaseReportTable from "./pages/TableData/PurchaseReportTable";
import ProvisionalTable from "./pages/TableData/ProvisionalTable";
import ViewInvoiceTable from "./pages/TableData/ViewInvoiceTable";
import DueTable from "./pages/TableData/DueTable";
import PaymentDetailsTable from "./pages/TableData/PaymentDetailsTable";
import ViewReceiptTable from "./pages/TableData/ViewReceiptTable";
import DischargeTable from "./pages/TableData/DischargeTable";
import EditAdmission from "./pages/UpdateData/EditAdmission";
import EditBirth from "./pages/UpdateData/EditBirth";
import EditPatients from "./pages/UpdateData/EditPatients";
import EditDepartment from "./pages/UpdateData/EditDepartment";

import EditAppointment from "./pages/UpdateData/EditAppointment";
import EditNurse from "./pages/UpdateData/EditNurse";
import EditDocter from "./pages/UpdateData/EditDocter";
import EditPrescription from "./pages/UpdateData/EditPrescription";
import EditLedger from "./pages/UpdateData/EditLedger";

import EditBill from "./pages/UpdateData/EditBill";
import EditMoneyReceipt from "./pages/UpdateData/EditMoneyReceipt";

import Login from "./pages/Auth/Login";
import Profile from "./pages/Auth/Profile";
import { Toaster } from "sonner";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminAccessManagement from "./pages/Auth/AdminAccessManagement";
import Policy from "./pages/HelpPage/Policy";
import Terms from "./pages/HelpPage/Terms";
import Help from "./pages/HelpPage/Help";
import NetworkProvider from "./utils/NetworkProvider";
import RequireRole from "./utils/RequireRole";

function App() {
  return (
    <div className="app">
      <NetworkProvider>
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/privacy-policy" element={<Policy />} />
            <Route path="/terms-&-conditions" element={<Terms />} />
            <Route path="/help-center" element={<Help />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/permissions"
                element={
                  <RequireRole allowedRoles={["ADMIN"]}>
                    <AdminAccessManagement />
                  </RequireRole>
                }
              />

              {/* Help page */}

              {/* Admission Entry  */}
              <Route
                path="/admission-entries"
                element={<AddmissionEntriesTable />}
              />
              <Route path="/new-admission-entry" element={<AdmissionEntry />} />
              <Route path="/admission/:id" element={<EditAdmission />} />

              {/* Birth Entry */}
              <Route path="/birth-entries" element={<BirthEntriesTable />} />
              <Route path="/new-birth-register" element={<BirthRegister />} />
              <Route path="/birth/:id" element={<EditBirth />} />

              {/* patients */}
              <Route
                path="/patients-entries"
                element={<PatientsEntriesTable />}
              />
              <Route
                path="/new-patient-register"
                element={<PatientRegister />}
              />
              <Route path="/patient/:id" element={<EditPatients />} />

              {/* Department */}
              <Route path="/departments" element={<DepartmentTable />} />
              <Route path="/new-department" element={<NewDepartment />} />
              <Route path="/department/:id" element={<EditDepartment />} />

              {/* Appointments */}
              <Route path="/appointments" element={<AppointmentTable />} />
              <Route path="/new-appointment" element={<NewAppointment />} />
              <Route path="/appointment/:id" element={<EditAppointment />} />

              {/* Nurse */}
              <Route path="/nurses" element={<NurseTable />} />
              <Route path="/new-nurse" element={<NewNurse />} />
              <Route path="/nurse/:id" element={<EditNurse />} />

              {/* Doctors */}
              <Route path="/doctors" element={<DoctorTable />} />
              <Route path="/new-doctor" element={<NewDoctor />} />
              <Route path="/doctor/:id" element={<EditDocter />} />

              {/* Prescription */}
              <Route path="/prescriptions" element={<PrescriptionTable />} />
              <Route path="/new-prescription" element={<NewPrescription />} />
              <Route path="/prescription/:id" element={<EditPrescription />} />

              {/* Ledger */}
              <Route path="/new-ledger" element={<NewLedger />} />
              
              <Route path="/ledger/:ledgerName/:id" element={<EditLedger />} />

              {/* Ledger Tables */}
              <Route
                path="/ledger/patient-ledger"
                element={<PatientLedger />}
              />
              <Route path="/ledger/doctor-ledger" element={<DoctorLedger />} />
              <Route path="/ledger/cash-ledger" element={<CashLedger />} />
              <Route path="/ledger/bank-ledger" element={<BankLedger />} />

              {/* Transection */}
              <Route path="/bills" element={<BillTable />} />
              <Route path="/new-bill-entry" element={<NewBillEntry />} />
              <Route path="/bill/:id" element={<EditBill />} />

              <Route path="/money-receipts" element={<MoneyReceiptTable />} />
              <Route
                path="/new-money-receipt-entry"
                element={<NewMoneyReceiptEntry />}
              />
              <Route path="/money-receipt/:id" element={<EditMoneyReceipt />} />

              {/* Report */}
              <Route
                path="/purchase-report"
                element={<PurchaseReportTable />}
              />
              <Route
                path="/provisional-invoice-report"
                element={<ProvisionalTable />}
              />
              <Route path="/invoice/:id" element={<ViewInvoiceTable />} />
              <Route path="/due-lists" element={<DueTable />} />
              <Route
                path="/payment-detail/:id"
                element={<PaymentDetailsTable />}
              />
              <Route
                path="/view-money-receipts"
                element={<ViewReceiptTable />}
              />
              <Route path="/discharge-lists" element={<DischargeTable />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NetworkProvider>
    </div>
  );
}

export default App;
