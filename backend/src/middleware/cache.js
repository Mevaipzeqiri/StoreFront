const {getRedisClient} = require('../config/redis');

const cache = (duration = 300) => {
    return async (req, res, next) => {
        const redisClient = getRedisClient();

        if (!redisClient || !redisClient.isOpen) {
            console.log('⚠️  Redis not available, skipping cache');
            return next();
        }

        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                console.log(`🎯 Cache HIT: ${key}`);
                const data = JSON.parse(cachedData);
                return res.json({
                    ...data,
                    _cached: true,
                    _cacheKey: key,
                    _timestamp: new Date().toISOString()
                });
            }

            console.log(`❌ Cache MISS: ${key}`);

            const originalJson = res.json.bind(res);

            res.json = (data) => {
                res.json = originalJson;

                if (res.statusCode === 200 && data.success !== false) {
                    redisClient.setEx(key, duration, JSON.stringify(data))
                        .then(() => console.log(`💾 Cached: ${key} (TTL: ${duration}s)`))
                        .catch(err => console.error('Cache set error:', err));
                }

                return res.json(data);
            };

            next();
        } catch (error) {
            console.error('❌ Cache middleware error:', error);
            next();
        }
    };
};

const clearCache = async (pattern = '*') => {
    const redisClient = getRedisClient();

    if (!redisClient || !redisClient.isOpen) {
        console.log('⚠️  Redis not available');
        return {cleared: 0};
    }

    try {
        const keys = await redisClient.keys(`cache:${pattern}`);

        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`🗑️  Cleared ${keys.length} cache entries matching: ${pattern}`);
            return {cleared: keys.length, keys};
        }

        return {cleared: 0, message: 'No matching keys found'};
    } catch (error) {
        console.error('❌ Clear cache error:', error);
        return {error: error.message};
    }
};

const clearCacheKey = async (key) => {
    const redisClient = getRedisClient();

    if (!redisClient || !redisClient.isOpen) {
        return {cleared: false};
    }

    try {
        const result = await redisClient.del(`cache:${key}`);
        return {cleared: result > 0};
    } catch (error) {
        console.error('❌ Clear cache key error:', error);
        return {cleared: false, error: error.message};
    }
};

module.exports = {
    cache,
    clearCache,
    clearCacheKey
};