"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DepartmentController_1 = require("../controllers/DepartmentController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
// CREATE + LIST
router
    .route("/")
    .post(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DepartmentController_1.createDepartmentRecord)
    .get(DepartmentController_1.getAllDepartmentRecords);
// SEARCH & FILTER
router.get("/search", DepartmentController_1.searchDepartmentResults);
router.get("/filter", DepartmentController_1.filterDepartments);
// GET / UPDATE / DELETE
router
    .route("/:id")
    .get(DepartmentController_1.getDepartmentRecordById)
    .put(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DepartmentController_1.updateDepartmentRecord)
    .delete(authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), DepartmentController_1.deleteDepartmentRecord);
exports.default = router;
