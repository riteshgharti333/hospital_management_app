"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
router.post("/identify", AuthController_1.getUserByRegIdController); // Step 1
router.post("/login", AuthController_1.loginUserController); // Step 2
router.post("/set-password", AuthController_1.setNewPasswordController); // Step 3
exports.default = router;
