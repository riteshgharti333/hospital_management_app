import express from "express";
import {
  createEmployeeRecord,
  getAllEmployeeRecords,
  getEmployeeRecordById,
  updateEmployeeRecord,
  deleteEmployeeRecord,
} from "../../controllers/transection/EmployeeController";

const router = express.Router();

router.route("/")
  .post(createEmployeeRecord)
  .get(getAllEmployeeRecords);

router.route("/:id")
  .get(getEmployeeRecordById)
  .patch(updateEmployeeRecord)
  .delete(deleteEmployeeRecord);

export default router;
