"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PatientLedgerController_1 = require("../../controllers/ledger/PatientLedgerController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PatientLedgerController_1.createLedgerEntryRecord)
    .get(PatientLedgerController_1.getAllPatientLedgerEntryRecords);
router.route("/balance").get(PatientLedgerController_1.getPatientBalanceRecord);
router.get("/search", PatientLedgerController_1.searchPatientLedgerResults);
router.get("/filter", PatientLedgerController_1.filterPatientLedger);
router.get("/ledger-flow-summary", PatientLedgerController_1.getLedgerFlowSummaryController);
router
    .route("/:id")
    .get(PatientLedgerController_1.getLedgerEntryRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PatientLedgerController_1.updateLedgerEntryRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PatientLedgerController_1.deleteLedgerEntryRecord);
exports.default = router;
