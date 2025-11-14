"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar || null,
            profileCompleted: user.profileCompleted || false,
            school: user.school || null,
            course: user.course || null,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const { fullName, school, course } = req.body;
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (fullName)
            user.fullName = fullName;
        if (school !== undefined)
            user.school = school;
        if (course !== undefined)
            user.course = course;
        if (user.fullName && user.school && user.course) {
            user.profileCompleted = true;
        }
        const updated = await user.save();
        res.json({
            id: updated._id.toString(),
            fullName: updated.fullName,
            email: updated.email,
            avatar: updated.avatar || null,
            profileCompleted: updated.profileCompleted || false,
            school: updated.school || null,
            course: updated.course || null,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateProfile = updateProfile;
