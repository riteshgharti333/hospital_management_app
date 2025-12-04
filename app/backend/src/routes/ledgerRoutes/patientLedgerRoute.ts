import express from "express";
import {
  createLedgerEntryRecord,
  getAllPatientLedgerEntryRecords,
  getLedgerEntryRecordById,
  getPatientBalanceRecord,
  updateLedgerEntryRecord,
  deleteLedgerEntryRecord,
  searchPatientLedgerResults,
  filterPatientLedger,
} from "../../controllers/ledger/PatientLedgerController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createLedgerEntryRecord)
  .get(getAllPatientLedgerEntryRecords);

router.route("/balance").get(getPatientBalanceRecord);

router.get("/search", searchPatientLedgerResults);

router.get("/filter", filterPatientLedger);

router
  .route("/:id")
  .get(getLedgerEntryRecordById)
  .patch(isAuthenticated, isAdmin, updateLedgerEntryRecord)
  .delete(isAuthenticated, isAdmin, deleteLedgerEntryRecord);

export default router;
