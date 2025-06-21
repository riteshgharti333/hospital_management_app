"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PrescriptionController_1 = require("../controllers/PrescriptionController");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const router = express_1.default.Router();
router.route("/")
    .post(multer_middleware_1.uploadMiddleware.single("file"), PrescriptionController_1.createPrescriptionRecord)
    .get(PrescriptionController_1.getAllPrescriptionRecords);
router.route("/:id")
    .get(PrescriptionController_1.getPrescriptionRecordById)
    .patch(multer_middleware_1.uploadMiddleware.single("file"), PrescriptionController_1.updatePrescriptionRecord)
    .delete(PrescriptionController_1.deletePrescriptionRecord);
exports.default = router;
