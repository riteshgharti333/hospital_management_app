import express from "express";
import {
  createMoneyReceiptRecord,
  getAllMoneyReceiptRecords,
  getMoneyReceiptRecordById,
  updateMoneyReceiptRecord,
  deleteMoneyReceiptRecord,
} from "../../controllers/transection/MoneyReceiptController";

const router = express.Router();

router.route("/")
  .post(createMoneyReceiptRecord)
  .get(getAllMoneyReceiptRecords);

router.route("/:id")
  .get(getMoneyReceiptRecordById)
  .patch(updateMoneyReceiptRecord)
  .delete(deleteMoneyReceiptRecord);

export default router;