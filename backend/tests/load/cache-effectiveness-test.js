import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const cacheHits = new Counter('cache_hits');
const cacheMisses = new Counter('cache_misses');

export const options = {
    vus: 30,
    duration: '2m',
    thresholds: {
        'cache_hits': ['count>100'],
        'http_req_duration': ['p(95)<300'],
    }
};

export default function () {
    const baseURL = 'http://localhost:3000';

    // Request same data repeatedly (should be cached)
    const res = http.get(`${baseURL}/api/v1/products?page=1&limit=10`);

    check(res, {
        'status 200': (r) => r.status === 200,
    });

    // Track cache effectiveness
    try {
        const isCached = res.json('_cached');
        if (isCached) {
            cacheHits.add(1);
        } else {
            cacheMisses.add(1);
        }
    } catch (e) {
        cacheMisses.add(1);
    }

    sleep(0.5);
}

export function handleSummary(data) {
    const hits = data.metrics.cache_hits.values.count || 0;
    const misses = data.metrics.cache_misses.values.count || 0;
    const total = hits + misses;
    const hitRate = total > 0 ? (hits / total * 100).toFixed(2) : 0;

    console.log(`\n=== Cache Effectiveness ===`);
    console.log(`Cache Hits: ${hits}`);
    console.log(`Cache Misses: ${misses}`);
    console.log(`Hit Rate: ${hitRate}%`);
    console.log(`===========================\n`);

    return {
        'tests/results/cache-effectiveness-summary.json': JSON.stringify({
            ...data,
            cache_analysis: {
                hits,
                misses,
                total,
                hit_rate: hitRate + '%'
            }
        }, null, 2),
    };
}