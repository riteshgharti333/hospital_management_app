import express from "express";
import {
  createLedgerEntryRecord,
  getAllLedgerEntryRecords,
  getLedgerEntryRecordById,
  getPatientBalanceRecord,
  updateLedgerEntryRecord,
  deleteLedgerEntryRecord,
} from "../../controllers/ledger/PatientLedgerController";

const router = express.Router();

router.route("/")
  .post(createLedgerEntryRecord)
  .get(getAllLedgerEntryRecords);

router.route("/balance")
  .get(getPatientBalanceRecord);

router.route("/:id")
  .get(getLedgerEntryRecordById)
  .patch(updateLedgerEntryRecord)
  .delete(deleteLedgerEntryRecord);

export default router;