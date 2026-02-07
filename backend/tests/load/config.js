// Test configuration
export const config = {
    baseURL: 'http://localhost:3000',

    // Test users
    users: {
        admin: {
            email: 'admin@webstore.com',
            password: 'admin123'
        },
        user: {
            email: 'user@webstore.com',
            password: 'user123'
        }
    },

    // Thresholds for pass/fail
    thresholds: {
        http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% < 500ms, 99% < 1s
        http_req_failed: ['rate<0.05'], // Error rate < 5%
        checks: ['rate>0.95'] // 95% of checks should pass
    }
};