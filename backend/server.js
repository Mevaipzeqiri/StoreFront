const express = require("express");
const cors = require("cors");
const http = require('http');
require("dotenv").config();
const {errorHandler} = require('./src/middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./src/config/swagger');

const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:4200",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Web Store API Documentation"
}));

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

// Old routes for backward compatibility
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reference", referenceDataRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Web Store API",
        version: "1.0.0",
        documentation: `${req.protocol}://${req.get('host')}/api-docs`,
        graphql: `${req.protocol}://${req.get('host')}/graphql`,
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

const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = http.createServer(app);

// Start server with GraphQL
const startServer = async () => {
    try {
        const {createApolloServer, context} = require('./src/graphql/server');
        const {expressMiddleware} = require('@apollo/server/express4');

        // Set up Apollo Server with subscriptions
        const apolloServer = await createApolloServer(httpServer);

        // Apply Apollo middleware - cors and json are already set up globally
        app.use(
            '/graphql',
            expressMiddleware(apolloServer, {context})
        );

        // 404 handler
        app.use((req, res, next) => {
            const error = new Error(`Cannot find ${req.originalUrl} on this server`);
            error.statusCode = 404;
            error.status = 'fail';
            next(error);
        });

        // Global error handler
        app.use(errorHandler);

        httpServer.listen(PORT, () => {
            console.log(`\n🚀 Server is running on port ${PORT}`);
            console.log(`📚 REST API Documentation: http://localhost:${PORT}/api-docs`);
            console.log(`🔮 GraphQL Playground: http://localhost:${PORT}/graphql`);
            console.log(`🔌 GraphQL Subscriptions: ws://localhost:${PORT}/graphql`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;