import express from "express";
import {
  createInsuranceLedgerRecord,
  getAllInsuranceLedgerRecords,
  getInsuranceLedgerRecordById,
  getInsuranceSummaryReport,
  updateInsuranceLedgerRecord,
  deleteInsuranceLedgerRecord,
} from "../../controllers/ledger/InsuranceLedgerController";

const router = express.Router();

router.route("/")
  .post(createInsuranceLedgerRecord)
  .get(getAllInsuranceLedgerRecords);

router.route("/summary")
  .get(getInsuranceSummaryReport);

router.route("/:id")
  .get(getInsuranceLedgerRecordById)
  .patch(updateInsuranceLedgerRecord)
  .delete(deleteInsuranceLedgerRecord);

export default router;