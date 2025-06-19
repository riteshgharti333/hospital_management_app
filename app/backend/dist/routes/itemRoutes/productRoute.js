"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductController_1 = require("../../controllers/items/ProductController");
const router = express_1.default.Router();
router.route("/")
    .post(ProductController_1.createProductRecord)
    .get(ProductController_1.getAllProductRecords);
router.route("/:id")
    .get(ProductController_1.getProductRecordById)
    .patch(ProductController_1.updateProductRecord)
    .delete(ProductController_1.deleteProductRecord);
exports.default = router;
