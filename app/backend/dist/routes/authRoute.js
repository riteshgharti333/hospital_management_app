"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
router.post("/refresh-token", AuthController_1.refreshAccessTokenController);
router.post("/identify", AuthController_1.getUserByRegIdController); // Step 1
router.post("/login", AuthController_1.loginUserController); // Step 2
router.post("/set-password", AuthController_1.setNewPasswordController);
router.put("/change-password", authenticate_1.authenticateUser, AuthController_1.changePasswordController);
router.get("/profile", authenticate_1.authenticateUser, AuthController_1.getProfile);
router.post("/logout", authenticate_1.authenticateUser, AuthController_1.logoutUser);
router.put("/profile/update", authenticate_1.authenticateUser, (0, authorize_1.authorizeRoles)("ADMIN"), AuthController_1.updateProfile);
exports.default = router;
