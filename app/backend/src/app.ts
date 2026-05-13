import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware";

import authRoutes from "./routes/authRoute";

import departmentRoutes from "./routes/departmentRoute";
import admissionRoutes from "./routes/admissionRoute";
import birthRoutes from "./routes/birthRoute";
import patientRoutes from "./routes/patientRoute";
import appointmentRoutes from "./routes/appointmentRoute";
import nurseRoutes from "./routes/nurseRoute";
import doctorRoutes from "./routes/doctorRoute";
import prescriptionRoutes from "./routes/prescriptionRoute";

import cash from "./routes/cashRoute";
import bank from "./routes/bankRoute";
import ledger from "./routes/ledgerRoute";

import aiRoutes from "./modules/ai/routes/ai.routes"
 
// Admin
import adminRoutes from "./routes/adminRoutes";

// Password Reset
import passwordRoutes from "./routes/passwordRoutes";


// transection
import billRoutes from "./routes/transectionRoutes/billRoute";
import moneyReceiptRoutes from "./routes/transectionRoutes/moneyReceiptRoute";
import { ErrorHandler } from "./middlewares/errorHandler";

//
import dashboardRoutes from "./routes/dashboardRoute";

dotenv.config();

const app: Application = express();

const allowedOrigins = [
  "http://localhost:5173", 
  "https://hospital-management-app-nine.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  }),
);

// handle preflight
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);

// admin routes
app.use("/api/v1/admin", adminRoutes);

// password reset routes
app.use("/api/v1/password", passwordRoutes);

// dashboard route
app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/api/v1/admission", admissionRoutes);
app.use("/api/v1/birth", birthRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/nurse", nurseRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/prescription", prescriptionRoutes);

app.use("/api/v1/cash", cash);
app.use("/api/v1/bank", bank); 

app.use("/api/v1/ledger", ledger); 

app.use('/api/v1/ai', aiRoutes);


// transection
app.use("/api/v1/transection/bill", billRoutes);
app.use("/api/v1/transection/money-receipt", moneyReceiptRoutes);

// Sample Route
app.get("/", (_req, res) => {
  res.send("Welcome 🚀");
});

export default app;

app.use(errorMiddleware);
