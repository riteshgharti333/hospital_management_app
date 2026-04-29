"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const departmentRoute_1 = __importDefault(require("./routes/departmentRoute"));
const admissionRoute_1 = __importDefault(require("./routes/admissionRoute"));
const birthRoute_1 = __importDefault(require("./routes/birthRoute"));
const patientRoute_1 = __importDefault(require("./routes/patientRoute"));
const appointmentRoute_1 = __importDefault(require("./routes/appointmentRoute"));
const nurseRoute_1 = __importDefault(require("./routes/nurseRoute"));
const doctorRoute_1 = __importDefault(require("./routes/doctorRoute"));
const prescriptionRoute_1 = __importDefault(require("./routes/prescriptionRoute"));
const cashRoute_1 = __importDefault(require("./routes/cashRoute"));
const bankRoute_1 = __importDefault(require("./routes/bankRoute"));
const ledgerRoute_1 = __importDefault(require("./routes/ledgerRoute"));
// Admin
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
// Password Reset
const passwordRoutes_1 = __importDefault(require("./routes/passwordRoutes"));
// transection
const billRoute_1 = __importDefault(require("./routes/transectionRoutes/billRoute"));
const moneyReceiptRoute_1 = __importDefault(require("./routes/transectionRoutes/moneyReceiptRoute"));
//
const dashboardRoute_1 = __importDefault(require("./routes/dashboardRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:5173",
    "https://hospital-management-app-nine.vercel.app",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // allow requests with no origin (like Postman)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("CORS not allowed"));
    },
    credentials: true,
}));
// handle preflight
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1/auth", authRoute_1.default);
// admin routes
app.use("/api/v1/admin", adminRoutes_1.default);
// password reset routes
app.use("/api/v1/password", passwordRoutes_1.default);
// dashboard route
app.use("/api/v1/dashboard", dashboardRoute_1.default);
app.use("/api/v1/admission", admissionRoute_1.default);
app.use("/api/v1/birth", birthRoute_1.default);
app.use("/api/v1/patient", patientRoute_1.default);
app.use("/api/v1/department", departmentRoute_1.default);
app.use("/api/v1/appointment", appointmentRoute_1.default);
app.use("/api/v1/nurse", nurseRoute_1.default);
app.use("/api/v1/doctor", doctorRoute_1.default);
app.use("/api/v1/prescription", prescriptionRoute_1.default);
app.use("/api/v1/cash", cashRoute_1.default);
app.use("/api/v1/bank", bankRoute_1.default);
app.use("/api/v1/ledger", ledgerRoute_1.default);
// transection
app.use("/api/v1/transection/bill", billRoute_1.default);
app.use("/api/v1/transection/money-receipt", moneyReceiptRoute_1.default);
// Sample Route
app.get("/", (_req, res) => {
    res.send("Welcome 🚀");
});
exports.default = app;
app.use(errorMiddleware_1.errorMiddleware);
