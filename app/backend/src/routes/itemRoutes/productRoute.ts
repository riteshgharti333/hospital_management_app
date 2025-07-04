import express from "express";
import {
  createProductRecord,
  getAllProductRecords,
  getProductRecordById,
  updateProductRecord,
  deleteProductRecord,
} from "../../controllers/items/ProductController";
import { uploadMiddleware } from "../../middlewares/multer.middleware";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, uploadMiddleware.single("file"), createProductRecord)
  .get(getAllProductRecords);

router
  .route("/:id")
  .get(getProductRecordById)
  .patch(isAuthenticated, isAdmin, uploadMiddleware.single("file"), updateProductRecord)
  .delete(isAuthenticated, isAdmin, deleteProductRecord);

export default router;
