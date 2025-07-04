"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const EmployeeController_1 = require("../../controllers/transection/EmployeeController");
const multer_middleware_1 = require("../../middlewares/multer.middleware");
const isAuthenticated_1 = require("../../middlewares/isAuthenticated");
const isAdmin_1 = require("../../middlewares/isAdmin");
const router = express_1.default.Router();
router.route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, multer_middleware_1.uploadMiddleware.single("file"), EmployeeController_1.createEmployeeRecord)
    .get(EmployeeController_1.getAllEmployeeRecords);
router.route("/:id")
    .get(EmployeeController_1.getEmployeeRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, multer_middleware_1.uploadMiddleware.single("file"), EmployeeController_1.updateEmployeeRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, EmployeeController_1.deleteEmployeeRecord);
exports.default = router;
