const { getRedisClient } = require('../config/redis');
const logger = require('../config/logger');
const { cacheHits, cacheMisses } = require('../config/metrics');

const cache = (duration = 300) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const redis = getRedisClient();

        if (!redis || !redis.isOpen) {
            logger.warn('Redis not available, skipping cache');
            return next();
        }

        const key = `cache:${req.originalUrl}`;

        try {
            const cachedResponse = await redis.get(key);

            if (cachedResponse) {
                logger.debug('Cache HIT', { key });
                cacheHits.labels(key).inc();

                const data = JSON.parse(cachedResponse);
                return res.json({
                    ...data,
                    _cached: true,
                    _cacheKey: key,
                    _timestamp: new Date().toISOString()
                });
            }

            logger.debug('Cache MISS', { key });
            cacheMisses.labels(key).inc();

            const originalJson = res.json.bind(res);

            res.json = (body) => {
                redis.setEx(key, duration, JSON.stringify(body))
                    .then(() => logger.debug('Cache SET', { key, duration }))
                    .catch(err => logger.error('Cache SET failed', { key, error: err.message }));

                return originalJson(body);
            };

            next();
        } catch (error) {
            logger.error('Cache middleware error', { key, error: error.message });
            next();
        }
    };
};

const clearCache = async (pattern = '*') => {
    const redis = getRedisClient();

    if (!redis || !redis.isOpen) {
        throw new Error('Redis not connected');
    }

    try {
        const keys = await redis.keys(`cache:${pattern}`);
        if (keys.length > 0) {
            await redis.del(keys);
            logger.info('Cache cleared', { pattern, count: keys.length });
        }
        return keys.length;
    } catch (error) {
        logger.error('Clear cache failed', { pattern, error: error.message });
        throw error;
    }
};

const clearCacheKey = async (key) => {
    const redis = getRedisClient();

    if (!redis || !redis.isOpen) {
        throw new Error('Redis not connected');
    }

    try {
        const fullKey = key.startsWith('cache:') ? key : `cache:${key}`;
        await redis.del(fullKey);
        logger.info('Cache key cleared', { key: fullKey });
    } catch (error) {
        logger.error('Clear cache key failed', { key, error: error.message });
        throw error;
    }
};

module.exports = { cache, clearCache, clearCacheKey };