
import express from "express";
import {
  createDiagnosticsRecord,
  getAllDiagnosticsRecords,
  getDiagnosticsRecordById,
  getPatientDiagnosticsTotalRecord,
  updateDiagnosticsRecord,
  deleteDiagnosticsRecord,
} from "../../controllers/ledger/DiagnosticsLedgerController";

const router = express.Router();

router.route("/")
  .post(createDiagnosticsRecord)
  .get(getAllDiagnosticsRecords);

router.route("/total")
  .get(getPatientDiagnosticsTotalRecord);

router.route("/:id")
  .get(getDiagnosticsRecordById)
  .patch(updateDiagnosticsRecord)
  .delete(deleteDiagnosticsRecord);

export default router;