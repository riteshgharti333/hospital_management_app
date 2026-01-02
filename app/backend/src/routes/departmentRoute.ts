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

import { authenticateUser } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize";

const router = express.Router();

// CREATE + LIST
router
  .route("/")
  .post(
    authenticateUser,
    authorizeRoles("ADMIN"),
    createDepartmentRecord
  )
  .get(getAllDepartmentRecords);

// SEARCH & FILTER
router.get("/search", searchDepartmentResults);
router.get("/filter", filterDepartments);

// GET / UPDATE / DELETE
router
  .route("/:id")
  .get(getDepartmentRecordById)
  .put(
    authenticateUser,
    authorizeRoles("ADMIN"),
    updateDepartmentRecord
  )
  .delete(
    authenticateUser,
    authorizeRoles("ADMIN"),
    deleteDepartmentRecord
  );

export default router;
