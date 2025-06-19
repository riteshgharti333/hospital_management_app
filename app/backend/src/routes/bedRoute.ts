import express from "express";
import {
  createBedRecord,
  getAllBedRecords,
  getBedRecordById,
  updateBedRecord,
  deleteBedRecord,
} from "../controllers/BedController";

const router = express.Router();

router.route("/")
  .post(createBedRecord)
  .get(getAllBedRecords);

router.route("/:id")
  .get(getBedRecordById)
  .put(updateBedRecord)
  .delete(deleteBedRecord);

export default router;