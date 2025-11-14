import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { protect } from "../middleware/auth.middleware";


import {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);

router.post("/verify-email", verifyEmail);

router.post("/resend-code", resendVerificationCode);

router.post("/login", login);

router.get("/me", protect, getProfile);

router.put("/me", protect, updateProfile);

export default router;