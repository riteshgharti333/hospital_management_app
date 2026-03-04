"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PrescriptionController_1 = require("../controllers/PrescriptionController");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), multer_middleware_1.uploadMiddleware.single("file"), PrescriptionController_1.createPrescriptionRecord)
    .get(PrescriptionController_1.getAllPrescriptionRecords);
// SEARCH & FILTER
router.get("/search", PrescriptionController_1.searchPrescriptionsResults);
router.get("/filter", PrescriptionController_1.filterPrescriptions);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(PrescriptionController_1.getPrescriptionRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), multer_middleware_1.uploadMiddleware.single("file"), PrescriptionController_1.updatePrescriptionRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PrescriptionController_1.deletePrescriptionRecord);
exports.default = router;
