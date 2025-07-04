"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DiagnosticsLedgerController_1 = require("../../controllers/ledger/DiagnosticsLedgerController");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DiagnosticsLedgerController_1.createDiagnosticsRecord)
    .get(DiagnosticsLedgerController_1.getAllDiagnosticsRecords);
router.route("/total").get(DiagnosticsLedgerController_1.getPatientDiagnosticsTotalRecord);
router
    .route("/:id")
    .get(DiagnosticsLedgerController_1.getDiagnosticsRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DiagnosticsLedgerController_1.updateDiagnosticsRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DiagnosticsLedgerController_1.deleteDiagnosticsRecord);
exports.default = router;
