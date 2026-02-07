const express = require('express');
const router = express.Router();
const {authenticateToken, isAdmin} = require('../middleware/auth');
const {clearCache} = require('../middleware/cache');
const {getCacheStats} = require('../config/redis');

/**
 * @swagger
 * tags:
 *   name: Cache
 *   description: Cache management endpoints
 */

/**
 * @swagger
 * /cache/stats:
 *   get:
 *     summary: Get cache statistics
 *     tags: [Cache]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cache statistics
 */
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const stats = await getCacheStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get cache stats',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /cache/clear:
 *   delete:
 *     summary: Clear all cache or by pattern
 *     tags: [Cache]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pattern
 *         schema:
 *           type: string
 *         description: Pattern to match cache keys
 *         example: products*
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 */
router.delete('/clear', authenticateToken, isAdmin, async (req, res) => {
    try {
        const {pattern = '*'} = req.query;
        const result = await clearCache(pattern);
        res.json({
            success: true,
            message: 'Cache cleared successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to clear cache',
            error: error.message
        });
    }
});

module.exports = router;