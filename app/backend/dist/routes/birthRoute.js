"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BirthController_1 = require("../controllers/BirthController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BirthController_1.createBirthRecord)
    .get(BirthController_1.getAllBirth);
// SEARCH & FILTER
router.get("/search", BirthController_1.searchBirthResults);
router.get("/filter", BirthController_1.filterBirths);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(BirthController_1.getBirthRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BirthController_1.updateBirthRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BirthController_1.deleteBirthRecord);
exports.default = router;
