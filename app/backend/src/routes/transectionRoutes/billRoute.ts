import express from "express";
import {
  createBillRecord,
  getAllBillRecords,
  getBillRecordById,
  updateBillRecord,
  deleteBillRecord,
} from "../../controllers/transection/BillController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router.route("/")
  .post(isAuthenticated, isAdmin, createBillRecord)
  .get(getAllBillRecords);

router.route("/:id")
  .get(getBillRecordById)
  .patch(isAuthenticated, isAdmin, updateBillRecord)
  .delete(isAuthenticated, isAdmin, deleteBillRecord);

export default router;
