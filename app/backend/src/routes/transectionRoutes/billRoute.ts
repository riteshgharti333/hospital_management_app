import express from "express";
import {
  createBillRecord,
  getAllBillRecords,
  getBillRecordById,
  updateBillRecord,
  deleteBillRecord,
} from "../../controllers/transection/BillController";

const router = express.Router();

router.route("/")
  .post(createBillRecord)
  .get(getAllBillRecords);

router.route("/:id")
  .get(getBillRecordById)
  .patch(updateBillRecord)
  .delete(deleteBillRecord);

export default router;