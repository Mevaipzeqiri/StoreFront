import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';

// Test authenticated endpoints
export const options = {
    stages: [
        { duration: '1m', target: 20 },
        { duration: '2m', target: 20 },
        { duration: '1m', target: 0 },
    ],
    thresholds: config.thresholds
};

let authToken = '';

export function setup() {
    // Login once to get token
    const loginRes = http.post(
        `${config.baseURL}/api/v1/auth/login`,
        JSON.stringify(config.users.admin),
        { headers: { 'Content-Type': 'application/json' } }
    );

    if (loginRes.status === 200) {
        const token = loginRes.json('data.token');
        return { token };
    }

    return { token: null };
}

export default function (data) {
    const baseURL = config.baseURL;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`
    };

    // Test authenticated product listing
    let res = http.get(`${baseURL}/api/v1/products`, { headers });
    check(res, {
        'auth products status 200': (r) => r.status === 200,
    });

    sleep(1);

    // Test reports endpoint (admin only)
    res = http.get(`${baseURL}/api/v1/reports/revenue/summary`, { headers });
    check(res, {
        'reports status 200': (r) => r.status === 200,
        'reports cached': (r) => r.json('_cached') !== undefined
    });

    sleep(1);

    // Test cache stats (admin only)
    res = http.get(`${baseURL}/api/v1/cache/stats`, { headers });
    check(res, {
        'cache stats status 200': (r) => r.status === 200,
    });

    sleep(2);
}

export function handleSummary(data) {
    return {
        'tests/results/authenticated-test-summary.json': JSON.stringify(data, null, 2),
    };
}