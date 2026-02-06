const getBaseUrl = (req) => {
    return `${req.protocol}://${req.get('host')}`;
};

const addHATEOAS = (data, links) => {
    return {
        ...data,
        _links: links
    };
};

const productLinks = (req, productId) => {
    const baseUrl = getBaseUrl(req);
    return {
        self: {href: `${baseUrl}/api/v1/products/${productId}`, method: 'GET'},
        update: {href: `${baseUrl}/api/v1/products/${productId}`, method: 'PUT'},
        delete: {href: `${baseUrl}/api/v1/products/${productId}`, method: 'DELETE'},
        quantity: {href: `${baseUrl}/api/v1/products/${productId}/quantity`, method: 'GET'},
        updateStock: {href: `${baseUrl}/api/v1/products/${productId}/stock`, method: 'PATCH'},
        discounts: {href: `${baseUrl}/api/v1/discounts/product/${productId}`, method: 'GET'},
        all: {href: `${baseUrl}/api/v1/products`, method: 'GET'}
    };
};

const orderLinks = (req, orderId) => {
    const baseUrl = getBaseUrl(req);
    return {
        self: {href: `${baseUrl}/api/v1/orders/${orderId}`, method: 'GET'},
        updateStatus: {href: `${baseUrl}/api/v1/orders/${orderId}/status`, method: 'PATCH'},
        cancel: {href: `${baseUrl}/api/v1/orders/${orderId}/cancel`, method: 'PATCH'},
        all: {href: `${baseUrl}/api/v1/orders`, method: 'GET'}
    };
};

const clientLinks = (req, clientId) => {
    const baseUrl = getBaseUrl(req);
    return {
        self: {href: `${baseUrl}/api/v1/clients/${clientId}`, method: 'GET'},
        update: {href: `${baseUrl}/api/v1/clients/${clientId}`, method: 'PUT'},
        delete: {href: `${baseUrl}/api/v1/clients/${clientId}`, method: 'DELETE'},
        orders: {href: `${baseUrl}/api/v1/orders/client/${clientId}`, method: 'GET'},
        all: {href: `${baseUrl}/api/v1/clients`, method: 'GET'}
    };
};

const userLinks = (req, userId) => {
    const baseUrl = getBaseUrl(req);
    return {
        self: {href: `${baseUrl}/api/v1/users/${userId}`, method: 'GET'},
        update: {href: `${baseUrl}/api/v1/users/${userId}`, method: 'PUT'},
        delete: {href: `${baseUrl}/api/v1/users/${userId}`, method: 'DELETE'},
        resetPassword: {href: `${baseUrl}/api/v1/users/${userId}/reset-password`, method: 'PATCH'},
        toggleStatus: {href: `${baseUrl}/api/v1/users/${userId}/toggle-status`, method: 'PATCH'},
        all: {href: `${baseUrl}/api/v1/users`, method: 'GET'}
    };
};

const discountLinks = (req, discountId) => {
    const baseUrl = getBaseUrl(req);
    return {
        self: {href: `${baseUrl}/api/v1/discounts/${discountId}`, method: 'GET'},
        update: {href: `${baseUrl}/api/v1/discounts/${discountId}`, method: 'PUT'},
        deactivate: {href: `${baseUrl}/api/v1/discounts/${discountId}/deactivate`, method: 'PATCH'},
        delete: {href: `${baseUrl}/api/v1/discounts/${discountId}`, method: 'DELETE'},
        all: {href: `${baseUrl}/api/v1/discounts`, method: 'GET'}
    };
};

const paginationLinks = (req, page, limit, total) => {
    const baseUrl = getBaseUrl(req);
    const totalPages = Math.ceil(total / limit);
    const currentPage = parseInt(page);

    const queryParams = {...req.query};
    delete queryParams.page;
    const queryString = new URLSearchParams(queryParams).toString();
    const baseQuery = queryString ? `?${queryString}&` : '?';

    const links = {
        self: {href: `${baseUrl}${req.path}${baseQuery}page=${currentPage}&limit=${limit}`},
        first: {href: `${baseUrl}${req.path}${baseQuery}page=1&limit=${limit}`},
        last: {href: `${baseUrl}${req.path}${baseQuery}page=${totalPages}&limit=${limit}`}
    };

    if (currentPage > 1) {
        links.prev = {href: `${baseUrl}${req.path}${baseQuery}page=${currentPage - 1}&limit=${limit}`};
    }

    if (currentPage < totalPages) {
        links.next = {href: `${baseUrl}${req.path}${baseQuery}page=${currentPage + 1}&limit=${limit}`};
    }

    return links;
};

module.exports = {
    addHATEOAS,
    productLinks,
    orderLinks,
    clientLinks,
    userLinks,
    discountLinks,
    paginationLinks
};