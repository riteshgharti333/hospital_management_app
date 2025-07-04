import express from "express";
import {
  createBedRecord,
  getAllBedRecords,
  getBedRecordById,
  updateBedRecord,
  deleteBedRecord,
} from "../controllers/BedController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createBedRecord)
  .get(getAllBedRecords);

router
  .route("/:id")
  .get(getBedRecordById)
  .put(isAuthenticated, isAdmin, updateBedRecord)
  .delete(isAuthenticated, isAdmin, deleteBedRecord);

export default router;
