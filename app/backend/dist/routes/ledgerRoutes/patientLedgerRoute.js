"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PatientLedgerController_1 = require("../../controllers/ledger/PatientLedgerController");
const router = express_1.default.Router();
router.route("/")
    .post(PatientLedgerController_1.createLedgerEntryRecord)
    .get(PatientLedgerController_1.getAllLedgerEntryRecords);
router.route("/balance")
    .get(PatientLedgerController_1.getPatientBalanceRecord);
router.route("/:id")
    .get(PatientLedgerController_1.getLedgerEntryRecordById)
    .patch(PatientLedgerController_1.updateLedgerEntryRecord)
    .delete(PatientLedgerController_1.deleteLedgerEntryRecord);
exports.default = router;
