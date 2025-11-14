import express from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getProfile as getCurrentUser,
  updateProfile as updateCurrentUser,
} from "../controllers/profile.controller";

const router = express.Router();
/**
 * @route   
 * @desc    
 * @access  
 */
router.get("/me", protect, getCurrentUser);
/**
 * @route   
 * @desc    
 * @access  
 */
router.put("/me", protect, updateCurrentUser);

export default router;
