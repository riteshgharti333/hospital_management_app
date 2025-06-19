"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DoctorController_1 = require("../controllers/DoctorController");
const router = express_1.default.Router();
router.route("/")
    .post(DoctorController_1.createDoctorRecord)
    .get(DoctorController_1.getAllDoctorRecords);
router.route("/:id")
    .get(DoctorController_1.getDoctorRecordById)
    .patch(DoctorController_1.updateDoctorRecord)
    .delete(DoctorController_1.deleteDoctorRecord);
exports.default = router;
