"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BedController_1 = require("../controllers/BedController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BedController_1.createBedRecord)
    .get(BedController_1.getAllBedRecords);
// SEARCH
router.get("/search", BedController_1.searchBedResults);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(BedController_1.getBedRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BedController_1.updateBedRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), BedController_1.deleteBedRecord);
exports.default = router;
