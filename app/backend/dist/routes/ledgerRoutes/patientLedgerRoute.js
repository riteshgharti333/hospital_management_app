"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PatientLedgerController_1 = require("../../controllers/ledger/PatientLedgerController");
// 🔥 extra ../ for deep folder
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PatientLedgerController_1.createLedgerEntryRecord)
    .get(PatientLedgerController_1.getAllPatientLedgerEntryRecords);
// SEARCH & FILTER
router.get("/search", PatientLedgerController_1.searchPatientLedgerResults);
router.get("/filter", PatientLedgerController_1.filterPatientLedger);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(PatientLedgerController_1.getLedgerEntryRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PatientLedgerController_1.updateLedgerEntryRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PatientLedgerController_1.deleteLedgerEntryRecord);
exports.default = router;
