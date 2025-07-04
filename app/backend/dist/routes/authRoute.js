"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/AuthController");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const router = express_1.default.Router();
router.post("/register", AuthController_1.register);
router.post("/login", rateLimiter_1.authLimiter, AuthController_1.login);
router.post("/logout", AuthController_1.logout);
router.get("/profile", isAuthenticated_1.isAuthenticated, AuthController_1.getMyProfile);
router.put("/update-profile", isAuthenticated_1.isAuthenticated, AuthController_1.updateProfile);
router.put("/change-password", isAuthenticated_1.isAuthenticated, AuthController_1.changePassword);
exports.default = router;
