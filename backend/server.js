const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {errorHandler} = require('./src/middleware/errorHandler');

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:4200",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const discountRoutes = require("./src/routes/discountRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const referenceDataRoutes = require("./src/routes/referenceDataRoutes");
const clientRoutes = require("./src/routes/clientRoutes");
const userRoutes = require("./src/routes/userRoutes");

// API v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/discounts", discountRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/reference", referenceDataRoutes);
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v1/users", userRoutes);

//Old routes before versioning
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/discounts", discountRoutes);
// app.use("/api/reports", reportRoutes);
// app.use("/api/reference", referenceDataRoutes);
// app.use("/api/clients", clientRoutes);
// app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Web Store API",
        version: "1.0.0",
        endpoints: {
            v1: "/api/v1",
            auth: "/api/v1/auth",
            products: "/api/v1/products",
            orders: "/api/v1/orders",
            discounts: "/api/v1/discounts",
            reports: "/api/v1/reports",
            reference: "/api/v1/reference",
            clients: "/api/v1/clients",
            users: "/api/v1/users",
        },
    });
});

// 404 handler
app.use((req, res, next) => {
    const error = new Error(`Cannot find ${req.originalUrl} on this server`);
    error.statusCode = 404;
    error.status = 'fail';
    next(error);
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
});

module.exports = app;
