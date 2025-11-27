// src/controllers/authController.js
const authService = require("../services/authService");

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const data = await authService.registerUser(
            username,
            email,
            password,
            role
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error during registration",
            error: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await authService.loginUser(email, password);

        res.json({
            success: true,
            message: "Login successful",
            data,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error during login",
            error: error.message,
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const data = await authService.getUserProfile(req.user.id);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving profile",
            error: error.message,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await authService.changeUserPassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        res.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error changing password",
            error: error.message,
        });
    }
};