"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.resendVerificationCode = exports.verifyEmail = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
const sendEmail_1 = require("../utils/sendEmail");
const register = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;
        // Validation
        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }
        const verificationCode = (0, sendEmail_1.generateVerificationCode)();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const user = await User_1.default.create({
            fullName,
            email,
            password,
            phone,
            isVerified: false,
            verificationCode,
            verificationCodeExpires,
        });
        const userId = String(user._id);
        let emailSent = false;
        try {
            const { text, html } = (0, sendEmail_1.verificationEmailTemplate)(fullName, verificationCode);
            await (0, sendEmail_1.sendEmail)({
                to: email,
                subject: "Verify Your Email - Learn & connect App",
                text,
                html,
            });
            emailSent = true;
            console.log("Verification email sent successfully to:", email);
        }
        catch (emailError) {
            console.error(" Email sending failed, but registration continued:", emailError.message);
            user.isVerified = true;
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            await user.save();
        }
        res.status(201).json({
            success: true,
            message: emailSent
                ? "Registration successful! Please check your email for verification code."
                : "Registration successful! Your account has been automatically verified.",
            data: {
                userId,
                email: user.email,
                fullName: user.fullName,
                isVerified: user.isVerified,
                emailSent,
            },
        });
    }
    catch (error) {
        console.error(" Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error.message,
        });
    }
};
exports.register = register;
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and verification code",
            });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified",
            });
        }
        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code",
            });
        }
        if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Verification code expired. Please request a new one.",
            });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();
        const userId = String(user._id);
        const token = (0, generateToken_1.generateToken)(userId, user.email);
        res.status(200).json({
            success: true,
            message: "Email verified successfully!",
            data: {
                token,
                user: {
                    id: userId,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    isVerified: user.isVerified,
                },
            },
        });
    }
    catch (error) {
        console.error(" Email verification error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during verification",
            error: error.message,
        });
    }
};
exports.verifyEmail = verifyEmail;
const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide email",
            });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified",
            });
        }
        const verificationCode = (0, sendEmail_1.generateVerificationCode)();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();
        try {
            const { text, html } = (0, sendEmail_1.verificationEmailTemplate)(user.fullName, verificationCode);
            await (0, sendEmail_1.sendEmail)({
                to: email,
                subject: "New Verification Code - Learn & connect App",
                text,
                html,
            });
            res.status(200).json({
                success: true,
                message: "New verification code sent to your email",
            });
        }
        catch (emailError) {
            console.error(" Resend email failed:", emailError.message);
            // Auto-verify since email isn't working
            user.isVerified = true;
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            await user.save();
            res.status(200).json({
                success: true,
                message: "Email service unavailable. Your account has been automatically verified.",
            });
        }
    }
    catch (error) {
        console.error(" Resend code error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
exports.resendVerificationCode = resendVerificationCode;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in",
            });
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const userId = String(user._id);
        const token = (0, generateToken_1.generateToken)(userId, user.email);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: userId,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    isVerified: user.isVerified,
                },
            },
        });
    }
    catch (error) {
        console.error(" Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message,
        });
    }
};
exports.login = login;
