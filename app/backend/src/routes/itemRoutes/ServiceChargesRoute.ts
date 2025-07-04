import express from "express";
import {
  createServiceChargeRecord,
  getAllServiceChargeRecords,
  getServiceChargeRecordById,
  updateServiceChargeRecord,
  deleteServiceChargeRecord,
} from "../../controllers/items/ServiceChargesController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createServiceChargeRecord)
  .get(getAllServiceChargeRecords);

router
  .route("/:id")
  .get(getServiceChargeRecordById)
  .patch(isAuthenticated, isAdmin, updateServiceChargeRecord)
  .delete(isAuthenticated, isAdmin, deleteServiceChargeRecord);

export default router;
