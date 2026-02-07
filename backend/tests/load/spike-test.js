import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';

// Spike Test: Sudden traffic surge
export const options = {
    stages: [
        { duration: '30s', target: 10 },   // Normal load
        { duration: '10s', target: 200 },  // Sudden spike!
        { duration: '1m', target: 200 },   // Maintain spike
        { duration: '30s', target: 10 },   // Drop back
        { duration: '30s', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<1500'],
        http_req_failed: ['rate<0.15'],
    }
};

export default function () {
    const baseURL = config.baseURL;

    let res = http.get(`${baseURL}/api/v1/products?page=1&limit=10`);

    check(res, {
        'status OK': (r) => r.status === 200 || r.status === 429
    });

    sleep(0.3);
}

export function handleSummary(data) {
    return {
        'tests/results/spike-test-summary.json': JSON.stringify(data, null, 2),
    };
}