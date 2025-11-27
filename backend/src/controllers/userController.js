// src/controllers/userController.js
const userService = require("../services/userService");

exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await userService.getAllUsers(page, limit);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving users",
            error: error.message,
        });
    }
};

exports.getAllRoles = async (req, res) => {
    try {
        const data = await userService.getAllRoles();

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get all roles error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving roles",
            error: error.message,
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await userService.getUserById(id);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get user by ID error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving user",
            error: error.message,
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const data = await userService.createUser(username, email, password, role);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data,
        });
    } catch (error) {
        console.error("Create user error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error creating user",
            error: error.message,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;
        const data = await userService.updateUser(id, username, email, role);

        res.json({
            success: true,
            message: "User updated successfully",
            data,
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating user",
            error: error.message,
        });
    }
};

exports.resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_password } = req.body;
        await userService.resetUserPassword(id, new_password);

        res.json({
            success: true,
            message: "User password reset successfully",
        });
    } catch (error) {
        console.error("Reset user password error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error resetting password",
            error: error.message,
        });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await userService.toggleUserStatus(id, req.user.id);

        res.json({
            success: true,
            message: `User ${
                data.is_active ? "activated" : "deactivated"
            } successfully`,
            data,
        });
    } catch (error) {
        console.error("Toggle user status error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error toggling user status",
            error: error.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id, req.user.id);

        res.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deleting user",
            error: error.message,
        });
    }
};