"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PrescriptionController_1 = require("../controllers/PrescriptionController");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router
    .route("/")
    .post(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, multer_middleware_1.uploadMiddleware.single("file"), PrescriptionController_1.createPrescriptionRecord)
    .get(PrescriptionController_1.getAllPrescriptionRecords);
router.get("/search", PrescriptionController_1.searchPrescriptionsResults);
router.get("/filter", PrescriptionController_1.filterPrescriptions);
router
    .route("/:id")
    .get(PrescriptionController_1.getPrescriptionRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, multer_middleware_1.uploadMiddleware.single("file"), PrescriptionController_1.updatePrescriptionRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, PrescriptionController_1.deletePrescriptionRecord);
exports.default = router;
