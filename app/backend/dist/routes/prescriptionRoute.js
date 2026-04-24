"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PrescriptionController_1 = require("../controllers/PrescriptionController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const upload_middleware_1 = require("../aws/upload.middleware");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN", "DOCTOR"), upload_middleware_1.upload.single("prescriptionDoc"), PrescriptionController_1.createPrescriptionRecord);
router.get("/", PrescriptionController_1.getAllPrescriptionRecords);
// SEARCH & FILTER
router.get("/search", PrescriptionController_1.searchPrescriptionResults);
router.get("/filter", PrescriptionController_1.filterPrescriptions);
router.post("/upload", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN", "DOCTOR"), upload_middleware_1.upload.single("prescriptionDoc"), PrescriptionController_1.uploadPrescriptionDoc);
// GET PRESCRIPTIONS BY ADMISSION
router.get("/admission/:admissionId", PrescriptionController_1.getPrescriptionsByAdmissionId);
// GET / UPDATE / DELETE BY ID
router
    .route("/:id")
    .get(PrescriptionController_1.getPrescriptionRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN", "DOCTOR"), upload_middleware_1.upload.single("prescriptionDoc"), // Add this
PrescriptionController_1.updatePrescriptionRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PrescriptionController_1.deletePrescriptionRecord);
exports.default = router;
