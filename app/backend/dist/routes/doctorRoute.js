"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DoctorController_1 = require("../controllers/DoctorController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DoctorController_1.createDoctorRecord)
    .get(DoctorController_1.getAllDoctorRecords);
router
    .route("/:id")
    .get(DoctorController_1.getDoctorRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DoctorController_1.updateDoctorRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DoctorController_1.deleteDoctorRecord);
exports.default = router;
