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
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router.route("/")
  .post(isAuthenticated, isAdmin, createPharmacyLedgerRecord)
  .get(getAllPharmacyLedgerRecords);

router.route("/summary/financial").get(getPharmacyFinancialSummary);
router.route("/summary/category").get(getPharmacyCategorySummary);

router.route("/:id")
  .get(getPharmacyLedgerRecordById)
  .patch(isAuthenticated, isAdmin, updatePharmacyLedgerRecord)
  .delete(isAuthenticated, isAdmin, deletePharmacyLedgerRecord);

export default router;
