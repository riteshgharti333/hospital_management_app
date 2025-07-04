import express from "express";
import {
  createLedgerEntryRecord,
  getAllLedgerEntryRecords,
  getLedgerEntryRecordById,
  getPatientBalanceRecord,
  updateLedgerEntryRecord,
  deleteLedgerEntryRecord,
} from "../../controllers/ledger/PatientLedgerController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router.route("/")
  .post(isAuthenticated, isAdmin, createLedgerEntryRecord)
  .get(getAllLedgerEntryRecords);

router.route("/balance").get(getPatientBalanceRecord);

router.route("/:id")
  .get(getLedgerEntryRecordById)
  .patch(isAuthenticated, isAdmin, updateLedgerEntryRecord)
  .delete(isAuthenticated, isAdmin, deleteLedgerEntryRecord);

export default router;
