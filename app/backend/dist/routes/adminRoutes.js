"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminUserController_1 = require("../controllers/adminUserController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
router.post("/doctor/create-access", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), adminUserController_1.giveDoctorAccess);
exports.default = router;
