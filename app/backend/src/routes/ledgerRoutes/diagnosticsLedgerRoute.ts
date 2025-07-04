import express from "express";
import {
  createDiagnosticsRecord,
  getAllDiagnosticsRecords,
  getDiagnosticsRecordById,
  getPatientDiagnosticsTotalRecord,
  updateDiagnosticsRecord,
  deleteDiagnosticsRecord,
} from "../../controllers/ledger/DiagnosticsLedgerController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createDiagnosticsRecord)
  .get(getAllDiagnosticsRecords);

router.route("/total").get(getPatientDiagnosticsTotalRecord);

router
  .route("/:id")
  .get(getDiagnosticsRecordById)
  .patch(isAuthenticated, isAdmin, updateDiagnosticsRecord)
  .delete(isAuthenticated, isAdmin, deleteDiagnosticsRecord);

export default router;
