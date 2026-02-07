import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';

// Stress Test: Find breaking point
export const options = {
    stages: [
        { duration: '2m', target: 50 },   // Ramp up to 50 users
        { duration: '3m', target: 100 },  // Ramp up to 100 users
        { duration: '3m', target: 150 },  // Ramp up to 150 users
        { duration: '2m', target: 200 },  // Push to 200 users
        { duration: '2m', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000', 'p(99)<2000'],
        http_req_failed: ['rate<0.1'], // Allow 10% errors in stress test
    }
};

export default function () {
    const baseURL = config.baseURL;

    // Simulate real user behavior
    const actions = [
        () => http.get(`${baseURL}/api/v1/products`),
        () => http.get(`${baseURL}/api/v1/products/search?category=Shirts`),
        () => http.get(`${baseURL}/api/v1/products/${Math.floor(Math.random() * 20) + 1}`),
        () => http.get(`${baseURL}/api/v1/reference/categories`),
        () => http.get(`${baseURL}/api/v1/reference/brands`)
    ];

    // Execute random action
    const action = actions[Math.floor(Math.random() * actions.length)];
    const res = action();

    check(res, {
        'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
    });

    sleep(0.5);
}

export function handleSummary(data) {
    return {
        'tests/results/stress-test-summary.json': JSON.stringify(data, null, 2),
    };
}