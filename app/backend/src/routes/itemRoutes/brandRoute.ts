import express from "express";
import {
  createBrandRecord,
  getAllBrandRecords,
  getBrandRecordById,
  updateBrandRecord,
  deleteBrandRecord,
} from "../../controllers/items/BrandController";
import { uploadMiddleware } from "../../middlewares/multer.middleware";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, isAdmin, uploadMiddleware.single("file"), createBrandRecord)
  .get(getAllBrandRecords);

router
  .route("/:id")
  .get(getBrandRecordById)
  .patch(isAuthenticated, isAdmin, uploadMiddleware.single("file"), updateBrandRecord)
  .delete(isAuthenticated, isAdmin, deleteBrandRecord);

export default router;
