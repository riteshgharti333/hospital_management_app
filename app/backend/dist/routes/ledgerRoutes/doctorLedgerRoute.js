"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DoctorLedgerController_1 = require("../../controllers/ledger/DoctorLedgerController");
// 🔥 extra ../ for deep folder
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DoctorLedgerController_1.createDoctorLedgerRecord)
    .get(DoctorLedgerController_1.getAllDoctorLedgerRecords);
// BALANCE (read-only)
router.get("/balance", DoctorLedgerController_1.getDoctorBalanceRecord);
// SEARCH & FILTER
router.get("/search", DoctorLedgerController_1.searchDoctorLedgerResults);
router.get("/filter", DoctorLedgerController_1.filterDoctorLedger);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(DoctorLedgerController_1.getDoctorLedgerRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DoctorLedgerController_1.updateDoctorLedgerRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DoctorLedgerController_1.deleteDoctorLedgerRecord);
exports.default = router;
