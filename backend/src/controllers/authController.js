const authService = require("../services/authService");

exports.register = async (req, res) => {
    try {
        const {username, email, password, role} = req.body;
        const data = await authService.registerUser(
            username,
            email,
            password,
            role
        );

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data,
            _links: {
                login: {href: `${baseUrl}/api/v1/auth/login`, method: 'POST'},
                profile: {href: `${baseUrl}/api/v1/auth/profile`, method: 'GET'}
            }
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
        const {email, password} = req.body;
        const data = await authService.loginUser(email, password);

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        res.json({
            success: true,
            message: "Login successful",
            data,
            _links: {
                profile: {href: `${baseUrl}/api/v1/auth/profile`, method: 'GET'},
                changePassword: {href: `${baseUrl}/api/v1/auth/change-password`, method: 'POST'},
                products: {href: `${baseUrl}/api/v1/products`, method: 'GET'},
                orders: {href: `${baseUrl}/api/v1/orders`, method: 'GET'}
            }
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

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/auth/profile`, method: 'GET'},
                changePassword: {href: `${baseUrl}/api/v1/auth/change-password`, method: 'POST'}
            }
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
        const {currentPassword, newPassword} = req.body;
        await authService.changeUserPassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        res.json({
            success: true,
            message: "Password changed successfully",
            _links: {
                profile: {href: `${baseUrl}/api/v1/auth/profile`, method: 'GET'},
                login: {href: `${baseUrl}/api/v1/auth/login`, method: 'POST'}
            }
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