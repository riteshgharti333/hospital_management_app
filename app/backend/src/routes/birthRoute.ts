import express from "express";
import {
  createBirthRecord,
  getAllBirthRecords,
  getBirthRecordById,
  updateBirthRecord,
  deleteBirthRecord,
} from "../controllers/BirthController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createBirthRecord)
  .get(getAllBirthRecords);

router
  .route("/:id")
  .get(getBirthRecordById)
  .put(isAuthenticated, isAdmin, updateBirthRecord)
  .delete(isAuthenticated, isAdmin, deleteBirthRecord);

export default router;
