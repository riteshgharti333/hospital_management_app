import express from "express";
import {
  createSupplierLedgerRecord,
  getAllSupplierLedgerRecords,
  getSupplierLedgerRecordById,
  getSupplierOutstandingBalance,
  getSupplierSummaryReport,
  updateSupplierLedgerRecord,
  deleteSupplierLedgerRecord,
} from "../../controllers/ledger/SupplierLedgerController";

const router = express.Router();

router.route("/")
  .post(createSupplierLedgerRecord)
  .get(getAllSupplierLedgerRecords);

router.route("/outstanding")
  .get(getSupplierOutstandingBalance);

router.route("/summary")
  .get(getSupplierSummaryReport);

router.route("/:id")
  .get(getSupplierLedgerRecordById)
  .patch(updateSupplierLedgerRecord)
  .delete(deleteSupplierLedgerRecord);

export default router;