import express from "express";
import {
  createNurseRecord,
  getAllNurseRecords,
  getNurseRecordById,
  updateNurseRecord,
  deleteNurseRecord,
} from "../controllers/NurseController";

const router = express.Router();

router.route("/")
  .post(createNurseRecord)
  .get(getAllNurseRecords);

router.route("/:id")
  .get(getNurseRecordById)
  .patch(updateNurseRecord)
  .delete(deleteNurseRecord);

export default router;