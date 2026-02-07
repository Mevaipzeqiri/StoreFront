const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const {authenticateToken, isAdmin} = require('../middleware/auth');
const {cache} = require('../middleware/cache');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Elasticsearch-powered advanced search
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Advanced product search
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Full-text search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *       - in: query
 *         name: price_min
 *         schema:
 *           type: number
 *       - in: query
 *         name: price_max
 *         schema:
 *           type: number
 *       - in: query
 *         name: in_stock
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [relevance, price_asc, price_desc, name_asc, name_desc, newest]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results with facets
 */
router.get('/', cache(120), searchController.search);

/**
 * @swagger
 * /search/autocomplete:
 *   get:
 *     summary: Autocomplete suggestions
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (min 2 characters)
 *     responses:
 *       200:
 *         description: Autocomplete suggestions
 */
router.get('/autocomplete', searchController.autocomplete);

/**
 * @swagger
 * /search/reindex:
 *   post:
 *     summary: Reindex all products (Admin only)
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products reindexed successfully
 */
router.post('/reindex', authenticateToken, isAdmin, searchController.reindex);

/**
 * @swagger
 * /search/stats:
 *   get:
 *     summary: Get search index statistics
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: Index statistics
 */
router.get('/stats', searchController.getStats);

module.exports = router;