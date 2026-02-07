const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
    try {
        redisClient = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379
            }
        });

        redisClient.on('error', (err) => {
            console.error(' Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            console.log(' Connected to Redis');
        });

        redisClient.on('ready', () => {
            console.log(' Redis is ready');
        });

        await redisClient.connect();

        // Test connection
        await redisClient.ping();
        console.log(' Redis ping successful');

        return redisClient;
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
        console.log(' Continuing without Redis cache...');
        return null;
    }
};

const getRedisClient = () => {
    return redisClient;
};

const closeRedis = async () => {
    if (redisClient) {
        await redisClient.quit();
        console.log(' Redis connection closed');
    }
};

// Cache statistics
const getCacheStats = async () => {
    if (!redisClient || !redisClient.isOpen) {
        return {error: 'Redis not connected'};
    }

    try {
        const info = await redisClient.info('stats');
        const keys = await redisClient.keys('cache:*');

        return {
            connected: true,
            totalKeys: keys.length,
            cacheKeys: keys,
            info: info
        };
    } catch (error) {
        return {error: error.message};
    }
};

module.exports = {
    connectRedis,
    getRedisClient,
    closeRedis,
    getCacheStats
};