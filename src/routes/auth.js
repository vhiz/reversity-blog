import express from "express";
import { Login, Logout, Signup } from "../controllers/authController.js";
import limiter from "../middleware/limiter.js";
const router = express.Router();

router.post("/signup", limiter, Signup);

router.post("/login", Login);

router.post("/logout", Logout);

export default router;
