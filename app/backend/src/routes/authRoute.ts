import express from "express";
import { login, register, logout } from "../controllers/AuthController";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

router.post("/logout", logout);



export default router;
