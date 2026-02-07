const express = require("express");
const cors = require("cors");
const http = require('http');
const path = require('path');
const fs = require('fs');
require("dotenv").config();
const {errorHandler} = require('./src/middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./src/config/swagger');
const {connectRedis} = require('./src/config/redis');
const {connectElasticsearch} = require('./src/config/elasticsearch');
const {apiLimiter, speedLimiter, graphqlLimiter} = require('./src/middleware/rateLimiter');

const logger = require('./src/config/logger');
const {register} = require('./src/config/metrics');
const {
    morganMiddleware,
    metricsMiddleware,
    connectionTracker
} = require('./src/middleware/monitoring');

const app = express();

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:4200",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(morganMiddleware);
app.use(metricsMiddleware);
app.use(connectionTracker);

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.end(metrics);
    } catch (error) {
        logger.error('Error generating metrics', {error: error.message});
        res.status(500).end();
    }
});

app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

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
const cacheRoutes = require("./src/routes/cacheRoutes");
const searchRoutes = require("./src/routes/searchRoutes");

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const startServer = async () => {
    try {
        await connectRedis();
        await connectElasticsearch();

        const {createApolloServer, context} = require('./src/graphql/server');
        const {expressMiddleware} = require('@apollo/server/express4');

        const apolloServer = await createApolloServer(httpServer);

        app.use('/api/', apiLimiter);
        app.use('/api/', speedLimiter);

        // API v1 routes
        app.use("/api/v1/auth", authRoutes);
        app.use("/api/v1/products", productRoutes);
        app.use("/api/v1/orders", orderRoutes);
        app.use("/api/v1/discounts", discountRoutes);
        app.use("/api/v1/reports", reportRoutes);
        app.use("/api/v1/reference", referenceDataRoutes);
        app.use("/api/v1/clients", clientRoutes);
        app.use("/api/v1/users", userRoutes);
        app.use("/api/v1/cache", cacheRoutes);
        app.use("/api/v1/search", searchRoutes);

        // Old routes for backward compatibility
        app.use("/api/auth", authRoutes);
        app.use("/api/products", productRoutes);
        app.use("/api/orders", orderRoutes);
        app.use("/api/discounts", discountRoutes);
        app.use("/api/reports", reportRoutes);
        app.use("/api/reference", referenceDataRoutes);
        app.use("/api/clients", clientRoutes);
        app.use("/api/users", userRoutes);
        app.use("/api/cache", cacheRoutes);
        app.use("/api/search", searchRoutes);

        app.use(
            '/graphql',
            graphqlLimiter,
            expressMiddleware(apolloServer, {context})
        );

        app.get("/", (req, res) => {
            res.json({
                success: true,
                message: "Welcome to Web Store API",
                version: "1.0.0",
                documentation: `${req.protocol}://${req.get('host')}/api-docs`,
                graphql: `${req.protocol}://${req.get('host')}/graphql`,
                metrics: `${req.protocol}://${req.get('host')}/metrics`,
                health: `${req.protocol}://${req.get('host')}/health`,
                monitoring: {
                    prometheus: "http://localhost:9090",
                    grafana: "http://localhost:3001 (admin/admin123)",
                    kong_admin: "http://localhost:8001",
                    kong_proxy: "http://localhost:8000",
                    elasticsearch: "http://localhost:9200"
                },
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
                    cache: "/api/v1/cache",
                    search: "/api/v1/search"
                },
            });
        });

        // 404 handler
        app.use((req, res, next) => {
            const error = new Error(`Cannot find ${req.originalUrl} on this server`);
            error.statusCode = 404;
            error.status = 'fail';
            logger.warn('404 Not Found', {url: req.originalUrl, method: req.method});
            next(error);
        });

        // Global error handler
        app.use(errorHandler);

        httpServer.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
            console.log(`\n🚀 Server is running on port ${PORT}`);
            console.log(`📚 REST API Documentation: http://localhost:${PORT}/api-docs`);
            console.log(`🔮 GraphQL Playground: http://localhost:${PORT}/graphql`);
            console.log(`📌 GraphQL Subscriptions: ws://localhost:${PORT}/graphql`);
            console.log(`📊 Prometheus Metrics: http://localhost:${PORT}/metrics`);
            console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
            console.log(`🔍 Search API: http://localhost:${PORT}/api/v1/search`);
            console.log(`\n🎯 Monitoring Stack:`);
            console.log(`   Prometheus: http://localhost:9090`);
            console.log(`   Grafana: http://localhost:3001 (admin/admin123)`);
            console.log(`   Kong Admin: http://localhost:8001`);
            console.log(`   Kong Proxy: http://localhost:8000`);
            console.log(`   Elasticsearch: http://localhost:9200`);
        });
    } catch (error) {
        logger.error('Failed to start server', {error: error.message, stack: error.stack});
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;