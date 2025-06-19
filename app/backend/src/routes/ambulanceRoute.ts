import express from "express";
import {
  createAmbulanceRecord,
  getAllAmbulanceRecords,
  getAmbulanceRecordById,
  updateAmbulanceRecord,
  deleteAmbulanceRecord,
} from "../controllers/AmbulanceController";

const router = express.Router();

router.route("/")
  .post(createAmbulanceRecord)
  .get(getAllAmbulanceRecords);

router.route("/:id")
  .get(getAmbulanceRecordById)
  .patch(updateAmbulanceRecord)
  .delete(deleteAmbulanceRecord);

export default router;