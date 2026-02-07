const elasticsearchService = require('../services/elasticsearchService');
const logger = require('../config/logger');

exports.search = async (req, res) => {
    try {
        const result = await elasticsearchService.searchProducts(req.query);

        res.json({
            success: true,
            data: result.products,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            },
            facets: result.facets,
            query: req.query
        });
    } catch (error) {
        logger.error('Search error', {error: error.message});
        res.status(500).json({
            success: false,
            message: 'Search failed',
            error: error.message
        });
    }
};

exports.autocomplete = async (req, res) => {
    try {
        const {q} = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Query must be at least 2 characters'
            });
        }

        const suggestions = await elasticsearchService.autocomplete(q);

        res.json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        logger.error('Autocomplete error', {error: error.message});
        res.status(500).json({
            success: false,
            message: 'Autocomplete failed',
            error: error.message
        });
    }
};

exports.reindex = async (req, res) => {
    try {
        const result = await elasticsearchService.indexAllProducts();

        res.json({
            success: true,
            message: 'Products reindexed successfully',
            data: result
        });
    } catch (error) {
        logger.error('Reindex error', {error: error.message});
        res.status(500).json({
            success: false,
            message: 'Reindex failed',
            error: error.message
        });
    }
};

exports.getStats = async (req, res) => {
    try {
        const stats = await elasticsearchService.getIndexStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Stats error', {error: error.message});
        res.status(500).json({
            success: false,
            message: 'Failed to get stats',
            error: error.message
        });
    }
};