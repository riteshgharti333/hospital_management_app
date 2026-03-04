"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DiagnosticsLedgerController_1 = require("../../controllers/ledger/DiagnosticsLedgerController");
// import { isAuthenticated } from "../../middlewares/isAuthenticated";
// import { isAdmin } from "../../middlewares/isAdmin";
const router = express_1.default.Router();
// router
//   .route("/")
//   .post(isAuthenticated, isAdmin, createDiagnosticsRecord)
//   .get(getAllDiagnosticsRecords);
router.route("/total").get(DiagnosticsLedgerController_1.getPatientDiagnosticsTotalRecord);
// router
//   .route("/:id")
//   .get(getDiagnosticsRecordById)
//   .patch(isAuthenticated, isAdmin, updateDiagnosticsRecord)
//   .delete(isAuthenticated, isAdmin, deleteDiagnosticsRecord);
exports.default = router;
