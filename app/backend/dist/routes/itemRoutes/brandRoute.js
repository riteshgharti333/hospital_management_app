"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BrandController_1 = require("../../controllers/items/BrandController");
const multer_middleware_1 = require("../../middlewares/multer.middleware");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, multer_middleware_1.uploadMiddleware.single("file"), BrandController_1.createBrandRecord)
    .get(BrandController_1.getAllBrandRecords);
router
    .route("/:id")
    .get(BrandController_1.getBrandRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, multer_middleware_1.uploadMiddleware.single("file"), BrandController_1.updateBrandRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, BrandController_1.deleteBrandRecord);
exports.default = router;
