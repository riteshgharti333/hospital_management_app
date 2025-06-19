"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductEntryController_1 = require("../../controllers/items/ProductEntryController");
const router = express_1.default.Router();
router.route("/")
    .post(ProductEntryController_1.createProductRecord)
    .get(ProductEntryController_1.getAllProductRecords);
router.route("/:id")
    .get(ProductEntryController_1.getProductRecordById)
    .patch(ProductEntryController_1.updateProductRecord)
    .delete(ProductEntryController_1.deleteProductRecord);
exports.default = router;
