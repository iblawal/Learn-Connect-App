import { Request, Response } from "express";
import User from "../models/User";

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { fullName, school, course } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (school) user.school = school;
    if (course) user.course = course;

    const updated = await user.save();
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
