import express from "express";
import {
  createBirthRecord,
  getBirthRecordById,
  updateBirthRecord,
  deleteBirthRecord,
  searchBirthResults,
  getAllBirth,
  filterBirths,
} from "../controllers/BirthController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createBirthRecord)
  .get(getAllBirth);

router.get("/search", searchBirthResults);

router.get("/filter", filterBirths);

router
  .route("/:id")
  .get(getBirthRecordById)
  .put(isAuthenticated, isAdmin, updateBirthRecord)
  .delete(isAuthenticated, isAdmin, deleteBirthRecord);

export default router;
