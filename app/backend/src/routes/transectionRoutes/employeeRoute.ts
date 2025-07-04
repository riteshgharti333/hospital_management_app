import express from "express";
import {
  createEmployeeRecord,
  getAllEmployeeRecords,
  getEmployeeRecordById,
  updateEmployeeRecord,
  deleteEmployeeRecord,
} from "../../controllers/transection/EmployeeController";
import { uploadMiddleware } from "../../middlewares/multer.middleware";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router.route("/")
  .post(isAuthenticated, isAdmin, uploadMiddleware.single("file"), createEmployeeRecord)
  .get(getAllEmployeeRecords);

router.route("/:id")
  .get(getEmployeeRecordById)
  .patch(isAuthenticated, isAdmin, uploadMiddleware.single("file"), updateEmployeeRecord)
  .delete(isAuthenticated, isAdmin, deleteEmployeeRecord);

export default router;
