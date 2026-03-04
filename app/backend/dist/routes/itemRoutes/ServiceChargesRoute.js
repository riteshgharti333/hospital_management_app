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
//   .post(isAuthenticated, isAdmin, createServiceChargeRecord)
//   .get(getAllServiceChargeRecords);
// router
//   .route("/:id")
//   .get(getServiceChargeRecordById)
//   .patch(isAuthenticated, isAdmin, updateServiceChargeRecord)
//   .delete(isAuthenticated, isAdmin, deleteServiceChargeRecord);
exports.default = router;
