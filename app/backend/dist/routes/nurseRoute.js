"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NurseController_1 = require("../controllers/NurseController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), NurseController_1.createNurseRecord)
    .get(NurseController_1.getAllNurseRecords);
// SEARCH & FILTER
router.get("/search", NurseController_1.searchNurseResults);
router.get("/filter", NurseController_1.filterNurses);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(NurseController_1.getNurseRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), NurseController_1.updateNurseRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), NurseController_1.deleteNurseRecord);
exports.default = router;
