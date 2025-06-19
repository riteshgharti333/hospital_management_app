import express from "express";
import {
  createServiceChargeRecord,
  getAllServiceChargeRecords,
  getServiceChargeRecordById,
  updateServiceChargeRecord,
  deleteServiceChargeRecord,
} from "../../controllers/items/ServiceChargesController";

const router = express.Router();

router.route("/")
  .post(createServiceChargeRecord)
  .get(getAllServiceChargeRecords);

router.route("/:id")
  .get(getServiceChargeRecordById)
  .patch(updateServiceChargeRecord)
  .delete(deleteServiceChargeRecord);

export default router;