import express from "express";
import {
  createDepartmentRecord,
  getAllDepartmentRecords,
  getDepartmentRecordById,
  updateDepartmentRecord,
  deleteDepartmentRecord,
  searchDepartmentResults,
  filterDepartments,
} from "../controllers/DepartmentController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, createDepartmentRecord)
  .get(getAllDepartmentRecords);

router.get("/search", searchDepartmentResults);

router.get("/filter", filterDepartments);


router
  .route("/:id")
  .get(getDepartmentRecordById)
  .put(isAuthenticated, isAdmin, updateDepartmentRecord)
  .delete(isAuthenticated, isAdmin, deleteDepartmentRecord);

export default router;
