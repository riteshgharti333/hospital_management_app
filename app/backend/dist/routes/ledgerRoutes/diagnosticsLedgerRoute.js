"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DiagnosticsLedgerController_1 = require("../../controllers/ledger/DiagnosticsLedgerController");
const router = express_1.default.Router();
router.route("/")
    .post(DiagnosticsLedgerController_1.createDiagnosticsRecord)
    .get(DiagnosticsLedgerController_1.getAllDiagnosticsRecords);
router.route("/total")
    .get(DiagnosticsLedgerController_1.getPatientDiagnosticsTotalRecord);
router.route("/:id")
    .get(DiagnosticsLedgerController_1.getDiagnosticsRecordById)
    .patch(DiagnosticsLedgerController_1.updateDiagnosticsRecord)
    .delete(DiagnosticsLedgerController_1.deleteDiagnosticsRecord);
exports.default = router;
