const { getClient } = require('../config/elasticsearch');
const db = require('../config/database');
const logger = require('../config/logger');

const indexProduct = async (productId) => {
    try {
        const client = getClient();

        const result = await db.query(`
            SELECT p.*, 
                   c.name as category_name, 
                   b.name as brand_name,
                   g.name as gender_name,
                   col.name as color_name,
                   s.name as size_name,
                   (p.quantity - COALESCE((
                       SELECT SUM(oi.quantity) 
                       FROM order_items oi
                       JOIN orders o ON oi.order_id = o.id
                       WHERE oi.product_id = p.id 
                       AND o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
                   ), 0)) as current_quantity
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN genders g ON p.gender_id = g.id
            LEFT JOIN colors col ON p.color_id = col.id
            LEFT JOIN sizes s ON p.size_id = s.id
            WHERE p.id = $1
        `, [productId]);

        if (result.rows.length === 0) {
            throw new Error('Product not found');
        }

        const product = result.rows[0];

        await client.index({
            index: 'products',
            id: product.id.toString(),
            body: product
        });

        logger.info('Product indexed', { productId });
        return product;
    } catch (error) {
        logger.error('Failed to index product', { productId, error: error.message });
        throw error;
    }
};

const indexAllProducts = async () => {
    try {
        const client = getClient();

        const result = await db.query(`
            SELECT p.*, 
                   c.name as category_name, 
                   b.name as brand_name,
                   g.name as gender_name,
                   col.name as color_name,
                   s.name as size_name,
                   (p.quantity - COALESCE((
                       SELECT SUM(oi.quantity) 
                       FROM order_items oi
                       JOIN orders o ON oi.order_id = o.id
                       WHERE oi.product_id = p.id 
                       AND o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
                   ), 0)) as current_quantity
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN genders g ON p.gender_id = g.id
            LEFT JOIN colors col ON p.color_id = col.id
            LEFT JOIN sizes s ON p.size_id = s.id
        `);

        const operations = result.rows.flatMap(product => [
            { index: { _index: 'products', _id: product.id.toString() } },
            product
        ]);

        if (operations.length > 0) {
            const bulkResponse = await client.bulk({ refresh: true, operations });

            if (bulkResponse.errors) {
                const erroredDocuments = [];
                bulkResponse.items.forEach((action, i) => {
                    const operation = Object.keys(action)[0];
                    if (action[operation].error) {
                        erroredDocuments.push({
                            status: action[operation].status,
                            error: action[operation].error
                        });
                    }
                });
                logger.error('Bulk indexing had errors', { errors: erroredDocuments });
            }

            logger.info('All products indexed', { count: result.rows.length });
            return { indexed: result.rows.length, errors: bulkResponse.errors };
        }

        return { indexed: 0, errors: false };
    } catch (error) {
        logger.error('Failed to index all products', { error: error.message });
        throw error;
    }
};

const deleteProduct = async (productId) => {
    try {
        const client = getClient();

        await client.delete({
            index: 'products',
            id: productId.toString()
        });

        logger.info('Product deleted from index', { productId });
    } catch (error) {
        if (error.meta?.statusCode !== 404) {
            logger.error('Failed to delete product from index', { productId, error: error.message });
            throw error;
        }
    }
};

const searchProducts = async (query) => {
    try {
        const client = getClient();

        const {
            q,              // Full-text search
            category,       // Exact category match
            brand,          // Exact brand match
            gender,         // Exact gender match
            color,          // Exact color match
            size,           // Exact size match
            price_min,      // Minimum price
            price_max,      // Maximum price
            in_stock,       // Only in-stock products
            sort_by = 'relevance',  // Sort: relevance, price_asc, price_desc, name_asc, name_desc
            page = 1,
            limit = 10
        } = query;

        const must = [];
        const filter = [];

        if (q) {
            must.push({
                multi_match: {
                    query: q,
                    fields: ['name^3', 'description^2', 'category_name', 'brand_name'],
                    fuzziness: 'AUTO',
                    operator: 'or'
                }
            });
        }

        if (category) {
            filter.push({ term: { 'category_name.keyword': category } });
        }
        if (brand) {
            filter.push({ term: { 'brand_name.keyword': brand } });
        }
        if (gender) {
            filter.push({ term: { gender_name: gender } });
        }
        if (color) {
            filter.push({ term: { color_name: color } });
        }
        if (size) {
            filter.push({ term: { size_name: size } });
        }

        if (price_min || price_max) {
            const priceRange = {};
            if (price_min) priceRange.gte = parseFloat(price_min);
            if (price_max) priceRange.lte = parseFloat(price_max);
            filter.push({ range: { price: priceRange } });
        }

        if (in_stock === 'true') {
            filter.push({ range: { current_quantity: { gt: 0 } } });
        }

        filter.push({ term: { is_active: true } });

        const searchBody = {
            query: {
                bool: {
                    must: must.length > 0 ? must : { match_all: {} },
                    filter
                }
            },
            from: (page - 1) * limit,
            size: parseInt(limit)
        };

        switch (sort_by) {
            case 'price_asc':
                searchBody.sort = [{ price: 'asc' }];
                break;
            case 'price_desc':
                searchBody.sort = [{ price: 'desc' }];
                break;
            case 'name_asc':
                searchBody.sort = [{ 'name.keyword': 'asc' }];
                break;
            case 'name_desc':
                searchBody.sort = [{ 'name.keyword': 'desc' }];
                break;
            case 'newest':
                searchBody.sort = [{ created_at: 'desc' }];
                break;
            default:
                break;
        }

        searchBody.aggs = {
            categories: {
                terms: { field: 'category_name.keyword', size: 20 }
            },
            brands: {
                terms: { field: 'brand_name.keyword', size: 20 }
            },
            price_ranges: {
                range: {
                    field: 'price',
                    ranges: [
                        { key: '0-50', to: 50 },
                        { key: '50-100', from: 50, to: 100 },
                        { key: '100-200', from: 100, to: 200 },
                        { key: '200+', from: 200 }
                    ]
                }
            }
        };

        const response = await client.search({
            index: 'products',
            body: searchBody
        });

        const hits = response.hits.hits.map(hit => ({
            ...hit._source,
            _score: hit._score
        }));

        return {
            products: hits,
            total: response.hits.total.value,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(response.hits.total.value / limit),
            facets: {
                categories: response.aggregations.categories.buckets,
                brands: response.aggregations.brands.buckets,
                price_ranges: response.aggregations.price_ranges.buckets
            }
        };
    } catch (error) {
        logger.error('Search failed', { query, error: error.message });
        throw error;
    }
};

const autocomplete = async (query) => {
    try {
        const client = getClient();

        const response = await client.search({
            index: 'products',
            body: {
                suggest: {
                    product_suggest: {
                        prefix: query,
                        completion: {
                            field: 'name.keyword',
                            size: 10,
                            skip_duplicates: true
                        }
                    }
                },
                _source: ['name', 'category_name', 'brand_name', 'price']
            }
        });

        return response.suggest.product_suggest[0].options.map(option => option._source);
    } catch (error) {
        logger.error('Autocomplete failed', { query, error: error.message });
        throw error;
    }
};

const getIndexStats = async () => {
    try {
        const client = getClient();

        const stats = await client.indices.stats({ index: 'products' });
        const count = await client.count({ index: 'products' });

        return {
            documentCount: count.count,
            indexSize: stats._all.primaries.store.size_in_bytes,
            indexSizeHuman: stats._all.primaries.store.size
        };
    } catch (error) {
        logger.error('Failed to get index stats', { error: error.message });
        throw error;
    }
};

module.exports = {
    indexProduct,
    indexAllProducts,
    deleteProduct,
    searchProducts,
    autocomplete,
    getIndexStats
};