import express from "express";
import {
  createProductRecord,
  getAllProductRecords,
  getProductRecordById,
  updateProductRecord,
  deleteProductRecord,
} from "../../controllers/items/ProductController";
import { uploadMiddleware } from "../../middlewares/multer.middleware";

const router = express.Router();

router.route("/")
  .post(uploadMiddleware.single("file") , createProductRecord)
  .get(getAllProductRecords);

router.route("/:id")
  .get(getProductRecordById)
  .patch(uploadMiddleware.single("file") , updateProductRecord)
  .delete(deleteProductRecord);

export default router;
