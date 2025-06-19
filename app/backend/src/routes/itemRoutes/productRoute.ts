import express from "express";
import {
  createProductRecord,
  getAllProductRecords,
  getProductRecordById,
  updateProductRecord,
  deleteProductRecord,
} from "../../controllers/items/ProductController";

const router = express.Router();

router.route("/")
  .post(createProductRecord)
  .get(getAllProductRecords);

router.route("/:id")
  .get(getProductRecordById)
  .patch(updateProductRecord)
  .delete(deleteProductRecord);

export default router;
