import express from "express";
import {
  createEmployeeRecord,
  getAllEmployeeRecords,
  getEmployeeRecordById,
  updateEmployeeRecord,
  deleteEmployeeRecord,
} from "../../controllers/transection/EmployeeController";

import { uploadMiddleware } from "../../middlewares/multer.middleware";


const router = express.Router();

router.route("/")
  .post(uploadMiddleware.single("file") , createEmployeeRecord)
  .get(getAllEmployeeRecords);

router.route("/:id")
  .get(getEmployeeRecordById)
  .patch( uploadMiddleware.single("file"),updateEmployeeRecord)
  .delete(deleteEmployeeRecord);

export default router;
