"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdmissionController_1 = require("../controllers/AdmissionController");
const router = express_1.default.Router();
router.route("/").post(AdmissionController_1.createAdmission).get(AdmissionController_1.getAllAdmissions);
router
    .route("/:id")
    .get(AdmissionController_1.getAdmissionById)
    .put(AdmissionController_1.updateAdmission)
    .delete(AdmissionController_1.deleteAdmission);
exports.default = router;
