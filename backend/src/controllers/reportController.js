const reportService = require("../services/reportService");

const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

exports.getDailyEarnings = async (req, res) => {
    try {
        const {date} = req.query;
        const data = await reportService.getDailyEarnings(date);
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reports/earnings/daily${date ? `?date=${date}` : ''}`, method: 'GET'},
                monthly: {href: `${baseUrl}/api/v1/reports/earnings/monthly`, method: 'GET'},
                range: {href: `${baseUrl}/api/v1/reports/earnings/range`, method: 'GET'},
                summary: {href: `${baseUrl}/api/v1/reports/revenue/summary`, method: 'GET'}
            }
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
        const {month, year} = req.query;
        const data = await reportService.getMonthlyEarnings(month, year);
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {
                    href: `${baseUrl}/api/v1/reports/earnings/monthly${month && year ? `?month=${month}&year=${year}` : ''}`,
                    method: 'GET'
                },
                daily: {href: `${baseUrl}/api/v1/reports/earnings/daily`, method: 'GET'},
                range: {href: `${baseUrl}/api/v1/reports/earnings/range`, method: 'GET'},
                summary: {href: `${baseUrl}/api/v1/reports/revenue/summary`, method: 'GET'}
            }
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
        const {start_date, end_date} = req.query;
        const data = await reportService.getEarningsByDateRange(
            start_date,
            end_date
        );
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {
                    href: `${baseUrl}/api/v1/reports/earnings/range?start_date=${start_date}&end_date=${end_date}`,
                    method: 'GET'
                },
                daily: {href: `${baseUrl}/api/v1/reports/earnings/daily`, method: 'GET'},
                monthly: {href: `${baseUrl}/api/v1/reports/earnings/monthly`, method: 'GET'},
                summary: {href: `${baseUrl}/api/v1/reports/revenue/summary`, method: 'GET'}
            }
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
        const {limit = 10} = req.query;
        const data = await reportService.getTopSellingProducts(limit);
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reports/products/top-selling?limit=${limit}`, method: 'GET'},
                lowStock: {href: `${baseUrl}/api/v1/reports/products/low-stock`, method: 'GET'},
                salesByCategory: {href: `${baseUrl}/api/v1/reports/sales/category`, method: 'GET'},
                salesByBrand: {href: `${baseUrl}/api/v1/reports/sales/brand`, method: 'GET'}
            }
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
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reports/sales/category`, method: 'GET'},
                byBrand: {href: `${baseUrl}/api/v1/reports/sales/brand`, method: 'GET'},
                topSelling: {href: `${baseUrl}/api/v1/reports/products/top-selling`, method: 'GET'}
            }
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
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reports/sales/brand`, method: 'GET'},
                byCategory: {href: `${baseUrl}/api/v1/reports/sales/category`, method: 'GET'},
                topSelling: {href: `${baseUrl}/api/v1/reports/products/top-selling`, method: 'GET'}
            }
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
        const {threshold = 10} = req.query;
        const result = await reportService.getLowStockProducts(threshold);
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            ...result,
            _links: {
                self: {href: `${baseUrl}/api/v1/reports/products/low-stock?threshold=${threshold}`, method: 'GET'},
                topSelling: {href: `${baseUrl}/api/v1/reports/products/top-selling`, method: 'GET'},
                allProducts: {href: `${baseUrl}/api/v1/products`, method: 'GET'}
            }
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
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reports/revenue/summary`, method: 'GET'},
                daily: {href: `${baseUrl}/api/v1/reports/earnings/daily`, method: 'GET'},
                monthly: {href: `${baseUrl}/api/v1/reports/earnings/monthly`, method: 'GET'},
                range: {href: `${baseUrl}/api/v1/reports/earnings/range`, method: 'GET'}
            }
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