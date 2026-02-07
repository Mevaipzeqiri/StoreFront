import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 5,
    duration: '30s',
};

export default function () {
    const baseURL = 'http://localhost:3000';

    const res = http.get(`${baseURL}/api/v1/products?page=1&limit=10`);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'has data': (r) => {
            try {
                return r.json('data') !== undefined;
            } catch (e) {
                return false;
            }
        }
    });

    sleep(1);
}

export function handleSummary(data) {
    const metrics = data.metrics;
    const passed = metrics.checks.values.rate > 0.9;

    console.log('\n' + '='.repeat(50));
    console.log(passed ? '✅ QUICK TEST PASSED' : '❌ QUICK TEST FAILED');
    console.log('='.repeat(50));
    console.log(`Requests: ${metrics.http_reqs.values.count}`);
    console.log(`Failed: ${(metrics.http_req_failed.values.rate * 100).toFixed(2)}%`);
    console.log(`Avg Response: ${metrics.http_req_duration.values.avg.toFixed(2)}ms`);
    console.log(`P95 Response: ${metrics.http_req_duration.values['p(95)'].toFixed(2)}ms`);
    console.log(`Check Success: ${(metrics.checks.values.rate * 100).toFixed(2)}%`);
    console.log('='.repeat(50) + '\n');

    return {
        'stdout': '',
    };
}