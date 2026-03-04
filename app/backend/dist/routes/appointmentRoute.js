"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppointmentController_1 = require("../controllers/AppointmentController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AppointmentController_1.createAppointmentRecord)
    .get(AppointmentController_1.getAllAppointmentRecords);
// SEARCH & FILTER
router.get("/search", AppointmentController_1.searchAppointmentResults);
router.get("/filter", AppointmentController_1.filterAppointments);
// GET / UPDATE / DELETE BY ID
router
    .route("/:id")
    .get(AppointmentController_1.getAppointmentRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AppointmentController_1.updateAppointmentRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AppointmentController_1.deleteAppointmentRecord);
exports.default = router;
