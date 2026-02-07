import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';

// Load Test: Test system under expected load
export const options = {
    stages: [
        { duration: '1m', target: 20 },  // Ramp up to 20 users
        { duration: '3m', target: 20 },  // Stay at 20 users
        { duration: '1m', target: 50 },  // Ramp up to 50 users
        { duration: '3m', target: 50 },  // Stay at 50 users
        { duration: '1m', target: 0 },   // Ramp down to 0
    ],
    thresholds: config.thresholds
};

export default function () {
    const baseURL = config.baseURL;

    // Test product listing with pagination
    const page = Math.floor(Math.random() * 5) + 1;
    let res = http.get(`${baseURL}/api/v1/products?page=${page}&limit=10`);

    check(res, {
        'products status 200': (r) => r.status === 200,
        'products response time OK': (r) => r.timings.duration < 500
    });

    sleep(1);

    // Test product search
    const categories = ['Shirts', 'Pants', 'Jackets', 'Shoes'];
    const category = categories[Math.floor(Math.random() * categories.length)];

    res = http.get(`${baseURL}/api/v1/products/search?category=${category}`);

    check(res, {
        'search status 200': (r) => r.status === 200,
        'search has data': (r) => r.json('data') !== undefined
    });

    sleep(1);

    // Test reference data (should be heavily cached)
    res = http.get(`${baseURL}/api/v1/reference/brands`);

    check(res, {
        'brands status 200': (r) => r.status === 200,
        'brands fast response': (r) => r.timings.duration < 100
    });

    sleep(2);
}

export function handleSummary(data) {
    return {
        'tests/results/load-test-summary.json': JSON.stringify(data, null, 2),
        'tests/results/load-test-summary.html': htmlReport(data)
    };
}

function htmlReport(data) {
    const date = new Date().toISOString();
    const metrics = data.metrics;

    // Safe metric access with defaults
    const getMetricValue = (metricPath, defaultValue = 0) => {
        try {
            const keys = metricPath.split('.');
            let value = metrics;
            for (const key of keys) {
                value = value[key];
                if (value === undefined || value === null) return defaultValue;
            }
            return value;
        } catch (e) {
            return defaultValue;
        }
    };

    const totalRequests = getMetricValue('http_reqs.values.count', 0);
    const failedRate = getMetricValue('http_req_failed.values.rate', 0);
    const avgDuration = getMetricValue('http_req_duration.values.avg', 0);
    const p95Duration = getMetricValue('http_req_duration.values.p(95)', 0);
    const p99Duration = getMetricValue('http_req_duration.values.p(99)', 0);
    const requestRate = getMetricValue('http_reqs.values.rate', 0);
    const checkRate = getMetricValue('checks.values.rate', 0);

    return `
<!DOCTYPE html>
<html>
<head>
    <title>k6 Load Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        .pass { color: green; font-weight: bold; }
        .fail { color: red; font-weight: bold; }
        .metric { background-color: #f9f9f9; }
        .warning { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .info { background-color: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 k6 Load Test Report</h1>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Test Duration:</strong> ${(data.state.testRunDurationMs / 1000).toFixed(2)}s</p>
        
        ${failedRate > 0.5 ? `
        <div class="warning">
            <strong>⚠️ Warning:</strong> High failure rate detected (${(failedRate * 100).toFixed(2)}%). 
            This usually means the server is not running or not accessible.
        </div>
        ` : ''}
        
        <h2>📊 Key Metrics</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Status</th>
            </tr>
            <tr class="metric">
                <td>Total Requests</td>
                <td>${totalRequests}</td>
                <td class="pass">✓</td>
            </tr>
            <tr class="metric">
                <td>Failed Requests</td>
                <td>${(failedRate * 100).toFixed(2)}%</td>
                <td class="${failedRate < 0.05 ? 'pass' : 'fail'}">
                    ${failedRate < 0.05 ? '✓' : '✗'}
                </td>
            </tr>
            <tr class="metric">
                <td>Avg Response Time</td>
                <td>${avgDuration.toFixed(2)}ms</td>
                <td class="pass">✓</td>
            </tr>
            <tr class="metric">
                <td>P95 Response Time</td>
                <td>${p95Duration.toFixed(2)}ms</td>
                <td class="${p95Duration < 500 ? 'pass' : 'fail'}">
                    ${p95Duration < 500 ? '✓' : '✗'}
                </td>
            </tr>
            <tr class="metric">
                <td>P99 Response Time</td>
                <td>${p99Duration.toFixed(2)}ms</td>
                <td class="${p99Duration < 1000 ? 'pass' : 'fail'}">
                    ${p99Duration < 1000 ? '✓' : '✗'}
                </td>
            </tr>
            <tr class="metric">
                <td>Requests/sec</td>
                <td>${requestRate.toFixed(2)}</td>
                <td class="pass">✓</td>
            </tr>
        </table>
        
        <h2>✅ Checks</h2>
        <table>
            <tr>
                <th>Check</th>
                <th>Success Rate</th>
            </tr>
            <tr>
                <td>Overall Checks</td>
                <td class="${checkRate > 0.95 ? 'pass' : 'fail'}">
                    ${(checkRate * 100).toFixed(2)}%
                </td>
            </tr>
        </table>
        
        <div class="info">
            <strong>ℹ️ Info:</strong> For accurate results, ensure your server is running at ${config.baseURL} before running tests.
        </div>
    </div>
</body>
</html>
    `;
}