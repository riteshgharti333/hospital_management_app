import express from "express";
import {
  createBirthRecord,
  getAllBirthRecords,
  getBirthRecordById,
  updateBirthRecord,
  deleteBirthRecord,
  searchBirthResults,
} from "../controllers/BirthController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createBirthRecord)
  .get(getAllBirthRecords);

router.get("/search", searchBirthResults);

router
  .route("/:id")
  .get(getBirthRecordById)
  .put(isAuthenticated, isAdmin, updateBirthRecord)
  .delete(isAuthenticated, isAdmin, deleteBirthRecord);

export default router;
