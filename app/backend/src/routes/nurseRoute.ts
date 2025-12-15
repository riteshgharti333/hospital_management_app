import express from "express";
import {
  createNurseRecord,
  getAllNurseRecords,
  getNurseRecordById,
  updateNurseRecord,
  deleteNurseRecord,
  searchNurseResults,
  filterNurses
} from "../controllers/NurseController";
import { isAdmin } from "../middlewares/isAdmin";
import { authenticateUser } from "../middlewares/authenticate";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, createNurseRecord)
  .get(getAllNurseRecords);

router.get("/search", searchNurseResults);

router.get("/filter", filterNurses);


router
  .route("/:id")
  .get(getNurseRecordById)
  .patch(authenticateUser, isAdmin, updateNurseRecord)
  .delete(authenticateUser, isAdmin, deleteNurseRecord);

export default router;
