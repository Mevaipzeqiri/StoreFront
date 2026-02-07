import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';

// Smoke Test: Verify system works with minimal load
export const options = {
    vus: 1, // 1 virtual user
    duration: '30s', // Run for 30 seconds
    thresholds: config.thresholds
};

export default function () {
    const baseURL = config.baseURL;

    // Test 1: Homepage
    let res = http.get(`${baseURL}/`);
    check(res, {
        'homepage status 200': (r) => r.status === 200,
        'homepage has message': (r) => r.json('message') !== undefined
    });

    sleep(1);

    // Test 2: Get products (should be cached)
    res = http.get(`${baseURL}/api/v1/products`);
    check(res, {
        'products status 200': (r) => r.status === 200,
        'products has data': (r) => r.json('data') !== undefined,
        'response time < 200ms': (r) => r.timings.duration < 200
    });

    sleep(1);

    // Test 3: Get reference data (should be cached)
    res = http.get(`${baseURL}/api/v1/reference/categories`);
    check(res, {
        'categories status 200': (r) => r.status === 200,
        'categories cached': (r) => r.json('_cached') === true || r.json('_cached') === undefined
    });

    sleep(1);

    // Test 4: Search products
    res = http.get(`${baseURL}/api/v1/products/search?category=Shirts&page=1&limit=10`);
    check(res, {
        'search status 200': (r) => r.status === 200,
        'search has results': (r) => r.json('data') !== undefined
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        'tests/results/smoke-test-summary.json': JSON.stringify(data, null, 2),
    };
}