"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const AdminUserController_1 = require("../controllers/AdminUserController");
const router = express_1.default.Router();
router.post("/staff/create-access", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AdminUserController_1.createStaffAccess);
router.post("/staff/toggle-access", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AdminUserController_1.toggleStaffAccess);
router.post("/staff/regenerate-temp-password", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AdminUserController_1.regenerateStaffTempPassword);
router.delete("/staff/:regId", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AdminUserController_1.deleteUserRecord);
exports.default = router;
router.get("/staff", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AdminUserController_1.getAllUsers);
