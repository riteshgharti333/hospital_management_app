"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PasswordController_1 = require("../controllers/PasswordController");
const authenticate_1 = require("../middlewares/authenticate");
const router = express_1.default.Router();
router.post("/forgot-password", PasswordController_1.forgotPassword);
router.post("/verify-otp", PasswordController_1.verifyResetOtp);
router.post("/reset-password", PasswordController_1.resetPassword);
router.post("/change-password", authenticate_1.authenticateUser, PasswordController_1.changePasswordLoggedIn);
exports.default = router;
