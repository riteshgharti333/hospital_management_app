import express from "express";
import {
  createBrandRecord,
  getAllBrandRecords,
  getBrandRecordById,
  updateBrandRecord,
  deleteBrandRecord,
} from "../../controllers/items/BrandController";
import { upload } from "../../middlewares/multer";
import { uploadMiddleware } from "../../middlewares/multer.middleware";

const router = express.Router();

router
  .route("/")
  .post(uploadMiddleware.single("file"), createBrandRecord)
  .get(getAllBrandRecords);

router
  .route("/:id")
  .get(getBrandRecordById)
  .patch(uploadMiddleware.single("file"), updateBrandRecord)
  .delete(deleteBrandRecord);

export default router;
