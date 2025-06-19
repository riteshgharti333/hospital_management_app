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
const bedRoute_1 = __importDefault(require("./routes/bedRoute"));
const bedAssignRoute_1 = __importDefault(require("./routes/bedAssignRoute"));
const appointmentRoute_1 = __importDefault(require("./routes/appointmentRoute"));
const nurseRoute_1 = __importDefault(require("./routes/nurseRoute"));
const doctorRoute_1 = __importDefault(require("./routes/doctorRoute"));
const pharmacistRoute_1 = __importDefault(require("./routes/pharmacistRoute"));
const prescriptionRoute_1 = __importDefault(require("./routes/prescriptionRoute"));
const ambulanceRoute_1 = __importDefault(require("./routes/ambulanceRoute"));
const xrayRoute_1 = __importDefault(require("./routes/xrayRoute"));
// ledger 
const patientLedgerRoute_1 = __importDefault(require("./routes/ledgerRoutes/patientLedgerRoute"));
const bankLedgerRoute_1 = __importDefault(require("./routes/ledgerRoutes/bankLedgerRoute"));
const cashLedgerRoute_1 = __importDefault(require("./routes/ledgerRoutes/cashLedgerRoute"));
const diagnosticsLedgerRoute_1 = __importDefault(require("./routes/ledgerRoutes/diagnosticsLedgerRoute"));
const doctorLedgerRoute_1 = __importDefault(require("./routes/ledgerRoutes/doctorLedgerRoute"));
const expenseLedgerRoute_1 = __importDefault(require("./routes/ledgerRoutes/expenseLedgerRoute"));
const insuranceLedgerRoute_1 = __importDefault(require("./routes/ledgerRoutes/insuranceLedgerRoute"));
const pharmacyLedgerRoute_1 = __importDefault(require("./routes/ledgerRoutes/pharmacyLedgerRoute"));
const supplierLedgerRoute_1 = __importDefault(require("./routes/ledgerRoutes/supplierLedgerRoute"));
// item/service
const brandRoute_1 = __importDefault(require("./routes/itemRoutes/brandRoute"));
const productRoute_1 = __importDefault(require("./routes/itemRoutes/productRoute"));
const productEntryRoute_1 = __importDefault(require("./routes/itemRoutes/productEntryRoute"));
const ServiceChargesRoute_1 = __importDefault(require("./routes/itemRoutes/ServiceChargesRoute"));
// transection
const billRoute_1 = __importDefault(require("./routes/transectionRoutes/billRoute"));
const employeeRoute_1 = __importDefault(require("./routes/transectionRoutes/employeeRoute"));
const voucherRoutes_1 = __importDefault(require("./routes/transectionRoutes/voucherRoutes"));
const moneyReceiptRoute_1 = __importDefault(require("./routes/transectionRoutes/moneyReceiptRoute"));
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new errorHandler_1.ErrorHandler("Not allowed by CORS", 403));
        }
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1/auth", authRoute_1.default);
app.use("/api/v1/admission", admissionRoute_1.default);
app.use("/api/v1/birth", birthRoute_1.default);
app.use("/api/v1/patient", patientRoute_1.default);
app.use("/api/v1/department", departmentRoute_1.default);
app.use("/api/v1/bed", bedRoute_1.default);
app.use("/api/v1/bed-assign", bedAssignRoute_1.default);
app.use("/api/v1/appointment", appointmentRoute_1.default);
app.use("/api/v1/nurse", nurseRoute_1.default);
app.use("/api/v1/doctor", doctorRoute_1.default);
app.use("/api/v1/pharmacist", pharmacistRoute_1.default);
app.use("/api/v1/prescription", prescriptionRoute_1.default);
app.use("/api/v1/ambulance", ambulanceRoute_1.default);
app.use("/api/v1/xray", xrayRoute_1.default);
// ledger
app.use("/api/v1/ledger/patient-ledger", patientLedgerRoute_1.default);
app.use("/api/v1/ledger/bank-ledger", bankLedgerRoute_1.default);
app.use("/api/v1/ledger/cash-ledger", cashLedgerRoute_1.default);
app.use("/api/v1/ledger/diagnostics-ledger", diagnosticsLedgerRoute_1.default);
app.use("/api/v1/ledger/doctor-ledger", doctorLedgerRoute_1.default);
app.use("/api/v1/ledger/expense-ledger", expenseLedgerRoute_1.default);
app.use("/api/v1/ledger/insurance-ledger", insuranceLedgerRoute_1.default);
app.use("/api/v1/ledger/pharmacy-ledger", pharmacyLedgerRoute_1.default);
app.use("/api/v1/ledger/supplier-ledger", supplierLedgerRoute_1.default);
// item/service
app.use("/api/v1/brand", brandRoute_1.default);
app.use("/api/v1/product", productRoute_1.default);
app.use("/api/v1/product-entry", productEntryRoute_1.default);
app.use("/api/v1/service-charges", ServiceChargesRoute_1.default);
// transection
app.use("/api/v1/transection/bill", billRoute_1.default);
app.use("/api/v1/transection/voucher", voucherRoutes_1.default);
app.use("/api/v1/transection/money-receipt", moneyReceiptRoute_1.default);
app.use("/api/v1/transection/employee", employeeRoute_1.default);
// Sample Route
app.get("/", (_req, res) => {
    res.send("Welcome 🚀");
});
exports.default = app;
app.use(errorMiddleware_1.errorMiddleware);
