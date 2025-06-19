import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware";

import authRoutes from "./routes/authRoute"

import departmentRoutes from "./routes/departmentRoute";
import admissionRoutes from "./routes/admissionRoute";
import birthRoutes from "./routes/birthRoute";
import patientRoutes from "./routes/patientRoute";
import bedRoutes from "./routes/bedRoute";
import bedAssignRoutes from "./routes/bedAssignRoute";
import appointmentRoutes from "./routes/appointmentRoute";
import nurseRoutes from "./routes/nurseRoute";
import doctorRoutes from "./routes/doctorRoute";
import pharmacistRoutes from "./routes/pharmacistRoute";
import prescriptionRoutes from "./routes/prescriptionRoute";
import ambulanceRoutes from "./routes/ambulanceRoute";
import xrayRoutes from "./routes/xrayRoute";

// ledger 
import patientLedgerRoutes from "./routes/ledgerRoutes/patientLedgerRoute";
import bankLedgerRoutes from "./routes/ledgerRoutes/bankLedgerRoute";
import cashLedgerRoutes from "./routes/ledgerRoutes/cashLedgerRoute";
import diagnosticsLedgerRoutes from "./routes/ledgerRoutes/diagnosticsLedgerRoute";
import doctorLedgerRoutes from "./routes/ledgerRoutes/doctorLedgerRoute";
import expenseLedgerRoutes from "./routes/ledgerRoutes/expenseLedgerRoute";
import insuranceLedgerRoutes from "./routes/ledgerRoutes/insuranceLedgerRoute";
import pharmacyLedgerRoutes from "./routes/ledgerRoutes/pharmacyLedgerRoute";
import supplierLedgerRoutes from "./routes/ledgerRoutes/supplierLedgerRoute";

// item/service
import brandRoutes from "./routes/itemRoutes/brandRoute";
import productRoutes from "./routes/itemRoutes/productRoute";
import productEnteryRoutes from "./routes/itemRoutes/productEntryRoute";
import serviceChargesRoutes from "./routes/itemRoutes/ServiceChargesRoute";

// transection
import billRoutes from "./routes/transectionRoutes/billRoute";
import employeeRoutes from "./routes/transectionRoutes/employeeRoute";
import voucherRoutes from "./routes/transectionRoutes/voucherRoutes";
import moneyReceiptRoutes from "./routes/transectionRoutes/moneyReceiptRoute";
import { ErrorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app: Application = express();

const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new ErrorHandler("Not allowed by CORS", 403));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/v1/auth", authRoutes);


app.use("/api/v1/admission", admissionRoutes);
app.use("/api/v1/birth", birthRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/bed", bedRoutes);
app.use("/api/v1/bed-assign", bedAssignRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/nurse", nurseRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/pharmacist", pharmacistRoutes);
app.use("/api/v1/prescription", prescriptionRoutes);
app.use("/api/v1/ambulance", ambulanceRoutes);
app.use("/api/v1/xray", xrayRoutes);

// ledger
app.use("/api/v1/ledger/patient-ledger", patientLedgerRoutes);
app.use("/api/v1/ledger/bank-ledger", bankLedgerRoutes);
app.use("/api/v1/ledger/cash-ledger", cashLedgerRoutes);
app.use("/api/v1/ledger/diagnostics-ledger", diagnosticsLedgerRoutes);
app.use("/api/v1/ledger/doctor-ledger", doctorLedgerRoutes);
app.use("/api/v1/ledger/expense-ledger", expenseLedgerRoutes);
app.use("/api/v1/ledger/insurance-ledger", insuranceLedgerRoutes);
app.use("/api/v1/ledger/pharmacy-ledger", pharmacyLedgerRoutes);
app.use("/api/v1/ledger/supplier-ledger", supplierLedgerRoutes);

// item/service
app.use("/api/v1/brand", brandRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/product-entry", productEnteryRoutes);
app.use("/api/v1/service-charges", serviceChargesRoutes);

// transection
app.use("/api/v1/transection/bill", billRoutes);
app.use("/api/v1/transection/voucher", voucherRoutes);
app.use("/api/v1/transection/money-receipt", moneyReceiptRoutes);
app.use("/api/v1/transection/employee", employeeRoutes);

// Sample Route
app.get("/", (_req, res) => {
  res.send("Welcome 🚀");
});

export default app;

app.use(errorMiddleware);
