"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdmissionController_1 = require("../controllers/AdmissionController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AdmissionController_1.createAdmission)
    .get(AdmissionController_1.getAllAdmissions);
// SEARCH & FILTER
router.get("/search", AdmissionController_1.searchAdmissionsResults);
router.get("/filter", AdmissionController_1.filterAdmissions);
// GET / UPDATE / DELETE BY ID    
router
    .route("/:id")
    .get(AdmissionController_1.getAdmissionById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AdmissionController_1.updateAdmission)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AdmissionController_1.deleteAdmission);
exports.default = router;
