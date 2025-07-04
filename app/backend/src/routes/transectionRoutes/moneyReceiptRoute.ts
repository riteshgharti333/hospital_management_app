import express from "express";
import {
  createMoneyReceiptRecord,
  getAllMoneyReceiptRecords,
  getMoneyReceiptRecordById,
  updateMoneyReceiptRecord,
  deleteMoneyReceiptRecord,
} from "../../controllers/transection/MoneyReceiptController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createMoneyReceiptRecord)
  .get(getAllMoneyReceiptRecords);

router
  .route("/:id")
  .get(getMoneyReceiptRecordById)
  .patch(isAuthenticated, isAdmin, updateMoneyReceiptRecord)
  .delete(isAuthenticated, isAdmin, deleteMoneyReceiptRecord);

export default router;
