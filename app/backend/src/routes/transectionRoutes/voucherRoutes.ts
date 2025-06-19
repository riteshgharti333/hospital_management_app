import express from "express";
import {
  createVoucherRecord,
  getAllVoucherRecords,
  getVoucherRecordById,
  updateVoucherRecord,
  deleteVoucherRecord,
} from "../../controllers/transection/VoucherController";

const router = express.Router();

router.route("/")
  .post(createVoucherRecord)
  .get(getAllVoucherRecords);

router.route("/:id")
  .get(getVoucherRecordById)
  .patch(updateVoucherRecord)
  .delete(deleteVoucherRecord);

export default router;