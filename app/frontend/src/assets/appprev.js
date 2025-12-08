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
import BedTable from "./pages/TableData/BedTable";
import NewBed from "./pages/Service/NewBed";
import BedAssignTable from "./pages/TableData/BedAssignTable";
import NewBedAssign from "./pages/Service/NewBedAssign";
import AppointmentTable from "./pages/TableData/AppointmentTable";
import NewAppointment from "./pages/Service/NewAppointment";
import NurseTable from "./pages/TableData/NurseTable";
import NewNurse from "./pages/Service/NewNurse";
import DoctorTable from "./pages/TableData/DoctorTable";
import NewDoctor from "./pages/Service/NewDoctor";
import PharmacistTable from "./pages/TableData/PharmacistTable";
import NewPharmacist from "./pages/Service/NewPharmacist";
import PrescriptionTable from "./pages/TableData/PrescriptionTable";
import NewPrescription from "./pages/Service/NewPrescription";
import NewXray from "./pages/Service/NewXray";
import XrayReportTable from "./pages/TableData/XrayReportTable";
import AmbulancesTable from "./pages/TableData/AmbulancesTable";
import NewAmbulance from "./pages/Service/NewAmbulance";
import NewLedger from "./pages/Service/NewLedger";
import PatientLedger from "./pages/LadgerTable/PatientLedger";
import DoctorLedger from "./pages/LadgerTable/DoctorLedger";
import SupplierLedger from "./pages/LadgerTable/SupplierLedger";
import PharmacyLedger from "./pages/LadgerTable/PharmacyLedger";
import DiagnosticsLedger from "./pages/LadgerTable/DiagnosticsLedger";
import CashLedger from "./pages/LadgerTable/CashLedger";
import BankLedger from "./pages/LadgerTable/BankLedger";
import InsuranceTPALedger from "./pages/LadgerTable/InsuranceTPALedger";
import GeneralExpenseLedger from "./pages/LadgerTable/GeneralExpenseLedger";
import CreationTable from "./pages/TableData/CreationTable";
import NewBrand from "./pages/Service/NewBrand";
import ProductTable from "./pages/TableData/ProductTable";
import NewProduct from "./pages/Service/NewProduct";
import ProductEntryTable from "./pages/TableData/ProductEntryTable";
import NewProductEntry from "./pages/Service/NewProductEntry";
import AllProductTable from "./pages/TableData/AllProductTable";
import ServiceChargesUpdate from "./pages/Service/ServiceChargesUpdate";
import NewBillEntry from "./pages/Service/NewBillEntry";
import NewMoneyReceiptEntry from "./pages/Service/NewMoneyReceiptEntry";
import BillTable from "./pages/TableData/BillTable";
import MoneyReceiptTable from "./pages/TableData/MoneyReceiptTable";
import VoucherTable from "./pages/TableData/VoucherTable";
import NewVoucher from "./pages/Service/NewVoucher";
import EmployeeTable from "./pages/TableData/EmployeeTable";
import NewEmployee from "./pages/Service/NewEmployee";
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
import EditBed from "./pages/UpdateData/EditBed";
import EditBedAssign from "./pages/UpdateData/EditBedAssign";
import EditAppointment from "./pages/UpdateData/EditAppointment";
import EditNurse from "./pages/UpdateData/EditNurse";
import EditDocter from "./pages/UpdateData/EditDocter";
import EditPharmacist from "./pages/UpdateData/EditPharmacist";
import EditPrescription from "./pages/UpdateData/EditPrescription";
import EditAmbulance from "./pages/UpdateData/EditAmbulance";
import EditLedger from "./pages/UpdateData/EditLedger";
import EditXray from "./pages/UpdateData/EditXray";
import EditBrand from "./pages/UpdateData/EditBrand";
import EditProduct from "./pages/UpdateData/EditProduct";
import EditProductEntry from "./pages/UpdateData/EditProductEntry";
import EditBill from "./pages/UpdateData/EditBill";
import EditMoneyReceipt from "./pages/UpdateData/EditMoneyReceipt";
import EditVoucher from "./pages/UpdateData/EditVoucher";
import EditEmployee from "./pages/UpdateData/EditEmployee";
import Login from "./pages/Auth/Login";
import Profile from "./pages/Auth/Profile";
import { Toaster } from "sonner";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

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
            <Route path="/new-patient-register" element={<PatientRegister />} />
            <Route path="/patient/:id" element={<EditPatients />} />

            {/* Department */}
            <Route path="/departments" element={<DepartmentTable />} />
            <Route path="/new-department" element={<NewDepartment />} />
            <Route path="/department/:id" element={<EditDepartment />} />

            {/* Bed Mster */}
            <Route path="/bed-master" element={<BedTable />} />
            <Route path="/new-bed" element={<NewBed />} />
            <Route path="/bed/:id" element={<EditBed />} />

            {/* Bed Assign */}
            <Route path="/bed-assign-management" element={<BedAssignTable />} />
            <Route path="/new-bed-assign" element={<NewBedAssign />} />
            <Route path="/bed-assign/:id" element={<EditBedAssign />} />

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

            {/* Pharmacist */}
            <Route path="/pharmacists" element={<PharmacistTable />} />
            <Route path="/new-pharmacist" element={<NewPharmacist />} />
            <Route path="/pharmacist/:id" element={<EditPharmacist />} />

            {/* Prescription */}
            <Route path="/prescriptions" element={<PrescriptionTable />} />
            <Route path="/new-prescription" element={<NewPrescription />} />
            <Route path="/prescription/:id" element={<EditPrescription />} />

            {/* Ambulance */}
            <Route path="/ambulances" element={<AmbulancesTable />} />
            <Route path="/new-ambulance" element={<NewAmbulance />} />
            <Route path="/ambulance/:id" element={<EditAmbulance />} />

            {/* Xray */}
            <Route path="/xray/new-xray" element={<NewXray />} />
            <Route
              path="/xray/xray-commision-report"
              element={<XrayReportTable />}
            />
            <Route path="/xray/:id" element={<EditXray />} />

            {/* Ledger */}
            <Route path="/new-ledger" element={<NewLedger />} />
            <Route path="/ledger/:ledgerName/:id" element={<EditLedger />} />

            {/* Ledger Tables */}
            <Route path="/ledger/patient-ledger" element={<PatientLedger />} />
            <Route path="/ledger/doctor-ledger" element={<DoctorLedger />} />
            <Route
              path="/ledger/supplier-ledger"
              element={<SupplierLedger />}
            />
            <Route
              path="/ledger/pharmacy-ledger"
              element={<PharmacyLedger />}
            />
            <Route path="ledger/lab-ledger" element={<DiagnosticsLedger />} />
            <Route path="/ledger/cash-ledger" element={<CashLedger />} />
            <Route path="/ledger/bank-ledger" element={<BankLedger />} />
            <Route
              path="/ledger/insurance-tpa-ledger"
              element={<InsuranceTPALedger />}
            />
            <Route
              path="/ledger/expense-ledger"
              element={<GeneralExpenseLedger />}
            />

            {/* Item Services */}
            <Route path="/company-creation" element={<CreationTable />} />
            <Route path="/brand/:id" element={<EditBrand />} />
            <Route path="/new-company-creation" element={<NewBrand />} />

            <Route path="/product-category" element={<ProductTable />} />
            <Route path="/add-product-category" element={<NewProduct />} />
            <Route path="/product/:id" element={<EditProduct />} />

            <Route path="/add-product" element={<ProductEntryTable />} />
            <Route path="/new-product-entry" element={<NewProductEntry />} />
            <Route path="/sub-product/:id" element={<EditProductEntry />} />
            <Route path="/all-products" element={<AllProductTable />} />
            <Route
              path="/service-charges-update"
              element={<ServiceChargesUpdate />}
            />

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

            <Route path="/payment-vouchers" element={<VoucherTable />} />
            <Route path="/new-voucher" element={<NewVoucher />} />
            <Route path="/voucher/:id" element={<EditVoucher />} />

            <Route path="/employees" element={<EmployeeTable />} />
            <Route path="/new-employee" element={<NewEmployee />} />
            <Route path="/employee/:id" element={<EditEmployee />} />

            {/* Report */}
            <Route path="/purchase-report" element={<PurchaseReportTable />} />
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
            <Route path="/view-money-receipts" element={<ViewReceiptTable />} />
            <Route path="/discharge-lists" element={<DischargeTable />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
