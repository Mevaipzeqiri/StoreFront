// src/controllers/orderController.js
const orderService = require("../services/orderService");

exports.getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const result = await orderService.getAllOrders(status, page, limit);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Get all orders error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving orders",
            error: error.message,
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await orderService.getOrderById(id);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Get order by ID error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving order",
            error: error.message,
        });
    }
};

exports.getOrdersByClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const result = await orderService.getOrdersByClient(clientId, page, limit);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Get orders by client error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving client orders",
            error: error.message,
        });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const data = await orderService.createOrder(req.body, req.user.id);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data,
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error creating order",
            error: error.message,
        });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const data = await orderService.updateOrderStatus(id, status);

        res.json({
            success: true,
            message: "Order status updated successfully",
            data,
        });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating order status",
            error: error.message,
        });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await orderService.cancelOrder(id);

        res.json({
            success: true,
            message: "Order cancelled successfully",
            data,
        });
    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error cancelling order",
            error: error.message,
        });
    }
};