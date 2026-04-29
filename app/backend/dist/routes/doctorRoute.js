"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DoctorController_1 = require("../controllers/DoctorController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE
router.post("/", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DoctorController_1.createDoctorRecord);
// LIST
router.get("/", DoctorController_1.getAllDoctorRecords);
// SEARCH & FILTER
router.get("/search", DoctorController_1.searchDoctorResults);
router.get("/filter", DoctorController_1.filterDoctors);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(DoctorController_1.getDoctorRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DoctorController_1.updateDoctorRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DoctorController_1.deleteDoctorRecord);
exports.default = router;
