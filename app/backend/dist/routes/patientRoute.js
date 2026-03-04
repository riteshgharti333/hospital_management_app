"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PatientController_1 = require("../controllers/PatientController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PatientController_1.createPatientRecord)
    .get(PatientController_1.getAllPatientRecords);
// SEARCH & FILTER
router.get("/search", PatientController_1.searchPatientResults);
router.get("/filter", PatientController_1.filterPatients);
// GET / UPDATE / DELETE BY ID
router
    .route("/:id")
    .get(PatientController_1.getPatientRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PatientController_1.updatePatientRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PatientController_1.deletePatientRecord);
exports.default = router;
