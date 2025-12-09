"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DoctorController_1 = require("../controllers/DoctorController");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const isAdmin_1 = require("../middlewares/isAdmin");
const authorize_1 = require("../middlewares/authorize");
const authenticate_1 = require("../middlewares/authenticate");
const router = express_1.default.Router();
router.post("/create", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DoctorController_1.createDoctorRecord);
// GET request to: /api/doctors/list
router.get("/", DoctorController_1.getAllDoctorRecords);
router.get("/search", DoctorController_1.searchDoctorResults);
router.get("/filter", DoctorController_1.filterDoctors);
router
    .route("/:id")
    .get(DoctorController_1.getDoctorRecordById)
    .patch(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DoctorController_1.updateDoctorRecord)
    .delete(isAuthenticated_1.isAuthenticated, isAdmin_1.isAdmin, DoctorController_1.deleteDoctorRecord);
exports.default = router;
