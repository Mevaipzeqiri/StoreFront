import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 1,
    duration: '5s',
    thresholds: {
        checks: ['rate>0.9']
    }
};

export default function () {
    const baseURL = 'http://localhost:3000';

    console.log('\n🔍 Running preflight checks...\n');

    // Check 1: Server is running
    const homeRes = http.get(baseURL);
    const serverRunning = check(homeRes, {
        '✓ Server is running': (r) => r.status === 200,
    });

    if (!serverRunning) {
        console.error('❌ Server is NOT running at ' + baseURL);
        console.error('   Start server with: npm start');
        return;
    }

    // Check 2: Database connection
    const productsRes = http.get(`${baseURL}/api/v1/products?limit=1`);
    const dbConnected = check(productsRes, {
        '✓ Database connected': (r) => r.status === 200 && r.json('data') !== undefined,
    });

    if (!dbConnected) {
        console.error('❌ Database is NOT connected');
        console.error('   Start database with: docker-compose up -d postgres');
    }

    // Check 3: Redis connection
    const categoriesRes = http.get(`${baseURL}/api/v1/reference/categories`);
    check(categoriesRes, {
        '✓ Redis connected (optional)': (r) => r.status === 200,
    });

    // Check 4: API documentation
    const docsRes = http.get(`${baseURL}/api-docs`);
    check(docsRes, {
        '✓ API documentation available': (r) => r.status === 200 || r.status === 301,
    });

    console.log('\n✅ All preflight checks passed!\n');
    console.log('Ready to run load tests.\n');
}