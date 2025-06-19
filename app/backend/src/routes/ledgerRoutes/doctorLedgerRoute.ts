import express from "express";
import {
  createDoctorLedgerRecord,
  getAllDoctorLedgerRecords,
  getDoctorLedgerRecordById,
  getDoctorBalanceRecord,
  updateDoctorLedgerRecord,
  deleteDoctorLedgerRecord,
} from "../../controllers/ledger/DoctorLedgerController";

const router = express.Router();

router.route("/")
  .post(createDoctorLedgerRecord)
  .get(getAllDoctorLedgerRecords);

router.route("/balance")
  .get(getDoctorBalanceRecord);

router.route("/:id")
  .get(getDoctorLedgerRecordById)
  .patch(updateDoctorLedgerRecord)
  .delete(deleteDoctorLedgerRecord);

export default router;