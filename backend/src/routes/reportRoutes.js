const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken, isAdminOrAdvanced } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Sales and inventory reporting endpoints
 */

/**
 * @swagger
 * /reports/earnings/daily:
 *   get:
 *     summary: Get daily earnings
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Specific date (defaults to today)
 *         example: 2024-01-15
 *     responses:
 *       200:
 *         description: Daily earnings report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                     total_orders:
 *                       type: integer
 *                     total_earnings:
 *                       type: number
 */
router.get('/earnings/daily', authenticateToken, isAdminOrAdvanced, reportController.getDailyEarnings);

/**
 * @swagger
 * /reports/earnings/monthly:
 *   get:
 *     summary: Get monthly earnings
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         description: Month (1-12, defaults to current month)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Year (defaults to current year)
 *     responses:
 *       200:
 *         description: Monthly earnings report
 */
router.get('/earnings/monthly', authenticateToken, isAdminOrAdvanced, reportController.getMonthlyEarnings);

/**
 * @swagger
 * /reports/earnings/range:
 *   get:
 *     summary: Get earnings by date range
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2024-01-01
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2024-01-31
 *     responses:
 *       200:
 *         description: Earnings by date range with daily breakdown
 */
router.get('/earnings/range', authenticateToken, isAdminOrAdvanced, reportController.getEarningsByDateRange);

/**
 * @swagger
 * /reports/products/top-selling:
 *   get:
 *     summary: Get top selling products
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products to return
 *     responses:
 *       200:
 *         description: Top selling products
 */
router.get('/products/top-selling', authenticateToken, isAdminOrAdvanced, reportController.getTopSellingProducts);

/**
 * @swagger
 * /reports/sales/category:
 *   get:
 *     summary: Get sales by category
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales breakdown by category
 */
router.get('/sales/category', authenticateToken, isAdminOrAdvanced, reportController.getSalesByCategory);

/**
 * @swagger
 * /reports/sales/brand:
 *   get:
 *     summary: Get sales by brand
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales breakdown by brand
 */
router.get('/sales/brand', authenticateToken, isAdminOrAdvanced, reportController.getSalesByBrand);

/**
 * @swagger
 * /reports/products/low-stock:
 *   get:
 *     summary: Get low stock products
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Stock quantity threshold
 *     responses:
 *       200:
 *         description: Products with low stock
 */
router.get('/products/low-stock', authenticateToken, isAdminOrAdvanced, reportController.getLowStockProducts);

/**
 * @swagger
 * /reports/revenue/summary:
 *   get:
 *     summary: Get revenue summary
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete revenue summary (today, this month, this year, all time)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     today:
 *                       type: object
 *                     this_month:
 *                       type: object
 *                     this_year:
 *                       type: object
 *                     all_time:
 *                       type: object
 *                     order_status_breakdown:
 *                       type: array
 */
router.get('/revenue/summary', authenticateToken, isAdminOrAdvanced, reportController.getRevenueSummary);

module.exports = router;