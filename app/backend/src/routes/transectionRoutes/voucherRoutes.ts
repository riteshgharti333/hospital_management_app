import express from "express";
import {
  createVoucherRecord,
  getAllVoucherRecords,
  getVoucherRecordById,
  updateVoucherRecord,
  deleteVoucherRecord,
} from "../../controllers/transection/VoucherController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router.route("/")
  .post(isAuthenticated, isAdmin, createVoucherRecord)
  .get(getAllVoucherRecords);

router.route("/:id")
  .get(getVoucherRecordById)
  .patch(isAuthenticated, isAdmin, updateVoucherRecord)
  .delete(isAuthenticated, isAdmin, deleteVoucherRecord);

export default router;
