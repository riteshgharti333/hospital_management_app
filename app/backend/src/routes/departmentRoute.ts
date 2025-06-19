import express from "express";
import {
  createDepartmentRecord,
  getAllDepartmentRecords,
  getDepartmentRecordById,
  updateDepartmentRecord,
  deleteDepartmentRecord,
} from "../controllers/DepartmentController";

const router = express.Router();

router.route("/")
  .post(createDepartmentRecord)
  .get(getAllDepartmentRecords);

router.route("/:id")
  .get(getDepartmentRecordById)
  .put(updateDepartmentRecord)
  .delete(deleteDepartmentRecord);

export default router;