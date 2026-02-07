const promClient = require('prom-client');

const register = new promClient.Registry();

promClient.collectDefaultMetrics({register});

const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

const httpRequestTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
    name: 'active_connections',
    help: 'Number of active connections'
});

const cacheHits = new promClient.Counter({
    name: 'cache_hits_total',
    help: 'Total number of cache hits',
    labelNames: ['cache_key']
});

const cacheMisses = new promClient.Counter({
    name: 'cache_misses_total',
    help: 'Total number of cache misses',
    labelNames: ['cache_key']
});

const authAttempts = new promClient.Counter({
    name: 'auth_attempts_total',
    help: 'Total number of authentication attempts',
    labelNames: ['result']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);
register.registerMetric(authAttempts);

module.exports = {
    register,
    httpRequestDuration,
    httpRequestTotal,
    activeConnections,
    cacheHits,
    cacheMisses,
    authAttempts
};