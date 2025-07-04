"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdmissionController_1 = require("../controllers/AdmissionController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router.post("/", isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, AdmissionController_1.createAdmission);
router.get("/", isAuthenticated_1.isAuthenticated, AdmissionController_1.getAllAdmissions);
router.get("/:id", isAuthenticated_1.isAuthenticated, AdmissionController_1.getAdmissionById);
router.put("/:id", isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, AdmissionController_1.updateAdmission);
router.delete("/:id", isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, AdmissionController_1.deleteAdmission);
exports.default = router;
