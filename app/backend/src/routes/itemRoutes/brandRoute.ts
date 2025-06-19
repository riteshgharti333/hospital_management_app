import express from "express";
import {
  createBrandRecord,
  getAllBrandRecords,
  getBrandRecordById,
  updateBrandRecord,
  deleteBrandRecord,
} from "../../controllers/items/BrandController";
import { upload } from "../../middlewares/multer";

const router = express.Router();

router
  .route("/")
  .post(upload.single("brandLogo"), createBrandRecord)
  .get(getAllBrandRecords);

router
  .route("/:id")
  .get(getBrandRecordById)
  .patch(upload.single("brandLogo"), updateBrandRecord)
  .delete(deleteBrandRecord);

export default router;
