// src/controllers/discountController.js
const discountService = require("../services/discountService");

exports.getAllDiscounts = async (req, res) => {
    try {
        const { is_active, page = 1, limit = 10 } = req.query;
        const result = await discountService.getAllDiscounts(
            is_active,
            page,
            limit
        );

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Get all discounts error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving discounts",
            error: error.message,
        });
    }
};

exports.getDiscountById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await discountService.getDiscountById(id);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get discount by ID error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving discount",
            error: error.message,
        });
    }
};

exports.getProductDiscounts = async (req, res) => {
    try {
        const { productId } = req.params;
        const { is_active } = req.query;
        const data = await discountService.getProductDiscounts(
            productId,
            is_active
        );

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get product discounts error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving product discounts",
            error: error.message,
        });
    }
};

exports.applyDiscount = async (req, res) => {
    try {
        const data = await discountService.applyDiscount(req.body, req.user.id);

        res.status(201).json({
            success: true,
            message: "Discount applied successfully",
            data,
        });
    } catch (error) {
        console.error("Apply discount error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error applying discount",
            error: error.message,
        });
    }
};

exports.updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await discountService.updateDiscount(id, req.body);

        res.json({
            success: true,
            message: "Discount updated successfully",
            data,
        });
    } catch (error) {
        console.error("Update discount error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating discount",
            error: error.message,
        });
    }
};

exports.deactivateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await discountService.deactivateDiscount(id);

        res.json({
            success: true,
            message: "Discount deactivated successfully",
            data,
        });
    } catch (error) {
        console.error("Deactivate discount error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deactivating discount",
            error: error.message,
        });
    }
};

exports.deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        await discountService.deleteDiscount(id);

        res.json({
            success: true,
            message: "Discount deleted successfully",
        });
    } catch (error) {
        console.error("Delete discount error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deleting discount",
            error: error.message,
        });
    }
};