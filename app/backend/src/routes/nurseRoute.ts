import express from "express";
import {
  createNurseRecord,
  getAllNurseRecords,
  getNurseRecordById,
  updateNurseRecord,
  deleteNurseRecord,
  searchNurseResults,
} from "../controllers/NurseController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createNurseRecord)
  .get(getAllNurseRecords);

router.get("/search", searchNurseResults);

router
  .route("/:id")
  .get(getNurseRecordById)
  .patch(isAuthenticated, isAdmin, updateNurseRecord)
  .delete(isAuthenticated, isAdmin, deleteNurseRecord);

export default router;
