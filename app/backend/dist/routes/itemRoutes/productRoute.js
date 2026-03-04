"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { isAuthenticated } from "../../middlewares/isAuthenticated";
// import { isAdmin } from "../../middlewares/isAdmin";
const router = express_1.default.Router();
// router
//   .route("/")
//   .post(isAuthenticated, isAdmin, uploadMiddleware.single("file"), createProductRecord)
//   .get(getAllProductRecords);
// router
//   .route("/:id")
//   .get(getProductRecordById)
//   .patch(isAuthenticated, isAdmin, uploadMiddleware.single("file"), updateProductRecord)
//   .delete(isAuthenticated, isAdmin, deleteProductRecord);
exports.default = router;
