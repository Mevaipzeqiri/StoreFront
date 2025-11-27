// src/controllers/reportController.js
const reportService = require("../services/reportService");

exports.getDailyEarnings = async (req, res) => {
    try {
        const { date } = req.query;
        const data = await reportService.getDailyEarnings(date);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get daily earnings error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving daily earnings",
            error: error.message,
        });
    }
};

exports.getMonthlyEarnings = async (req, res) => {
    try {
        const { month, year } = req.query;
        const data = await reportService.getMonthlyEarnings(month, year);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get monthly earnings error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving monthly earnings",
            error: error.message,
        });
    }
};

exports.getEarningsByDateRange = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        const data = await reportService.getEarningsByDateRange(
            start_date,
            end_date
        );

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get earnings by date range error:", error);
        res.status(error.status || 500).json({
            success: false,
            message:
                error.message || "Server error retrieving earnings by date range",
            error: error.message,
        });
    }
};

exports.getTopSellingProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const data = await reportService.getTopSellingProducts(limit);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get top selling products error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving top selling products",
            error: error.message,
        });
    }
};

exports.getSalesByCategory = async (req, res) => {
    try {
        const data = await reportService.getSalesByCategory();

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get sales by category error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving sales by category",
            error: error.message,
        });
    }
};

exports.getSalesByBrand = async (req, res) => {
    try {
        const data = await reportService.getSalesByBrand();

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get sales by brand error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving sales by brand",
            error: error.message,
        });
    }
};

exports.getLowStockProducts = async (req, res) => {
    try {
        const { threshold = 10 } = req.query;
        const result = await reportService.getLowStockProducts(threshold);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Get low stock products error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving low stock products",
            error: error.message,
        });
    }
};

exports.getRevenueSummary = async (req, res) => {
    try {
        const data = await reportService.getRevenueSummary();

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get revenue summary error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving revenue summary",
            error: error.message,
        });
    }
};