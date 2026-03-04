"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AmbulanceController_1 = require("../controllers/AmbulanceController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AmbulanceController_1.createAmbulanceRecord)
    .get(AmbulanceController_1.getAllAmbulanceRecords);
// SEARCH
router.get("/search", AmbulanceController_1.searchAmbulanceResults);
// GET / UPDATE / DELETE BY ID
router
    .route("/:id")
    .get(AmbulanceController_1.getAmbulanceRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AmbulanceController_1.updateAmbulanceRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AmbulanceController_1.deleteAmbulanceRecord);
exports.default = router;
