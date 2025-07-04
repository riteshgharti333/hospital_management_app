"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DepartmentController_1 = require("../controllers/DepartmentController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DepartmentController_1.createDepartmentRecord)
    .get(DepartmentController_1.getAllDepartmentRecords);
router
    .route("/:id")
    .get(DepartmentController_1.getDepartmentRecordById)
    .put(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DepartmentController_1.updateDepartmentRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DepartmentController_1.deleteDepartmentRecord);
exports.default = router;
