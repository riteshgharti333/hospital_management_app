import express from "express";
import {
  createPharmacistRecord,
  getAllPharmacistRecords,
  getPharmacistRecordById,
  updatePharmacistRecord,
  deletePharmacistRecord,
} from "../controllers/PharmacistController";

const router = express.Router();

router.route("/")
  .post(createPharmacistRecord)
  .get(getAllPharmacistRecords);

router.route("/:id")
  .get(getPharmacistRecordById)
  .patch(updatePharmacistRecord)
  .delete(deletePharmacistRecord);

export default router;