"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PatientController_1 = require("../controllers/PatientController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PatientController_1.createPatientRecord)
    .get(PatientController_1.getAllPatientRecords);
router
    .route("/:id")
    .get(PatientController_1.getPatientRecordById)
    .put(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PatientController_1.updatePatientRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PatientController_1.deletePatientRecord);
exports.default = router;
