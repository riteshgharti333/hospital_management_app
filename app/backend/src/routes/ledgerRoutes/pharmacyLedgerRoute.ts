import express from "express";
import {
  createPharmacyLedgerRecord,
  getAllPharmacyLedgerRecords,
  getPharmacyLedgerRecordById,
  getPharmacyFinancialSummary,
  getPharmacyCategorySummary,
  updatePharmacyLedgerRecord,
  deletePharmacyLedgerRecord,
} from "../../controllers/ledger/PharmacyLedgerController";

const router = express.Router();

router.route("/")
  .post(createPharmacyLedgerRecord)
  .get(getAllPharmacyLedgerRecords);

router.route("/summary/financial")
  .get(getPharmacyFinancialSummary);

router.route("/summary/category")
  .get(getPharmacyCategorySummary);

router.route("/:id")
  .get(getPharmacyLedgerRecordById)
  .patch(updatePharmacyLedgerRecord)
  .delete(deletePharmacyLedgerRecord);

export default router;