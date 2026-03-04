"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PharmacistController_1 = require("../controllers/PharmacistController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PharmacistController_1.createPharmacistRecord)
    .get(PharmacistController_1.getAllPharmacistRecords);
// SEARCH
router.get("/search", PharmacistController_1.searchPharmacistResults);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(PharmacistController_1.getPharmacistRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PharmacistController_1.updatePharmacistRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), PharmacistController_1.deletePharmacistRecord);
exports.default = router;
