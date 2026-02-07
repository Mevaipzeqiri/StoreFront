const {Client} = require('@elastic/elasticsearch');
const logger = require('./logger');

let client;

const connectElasticsearch = async () => {
    try {
        client = new Client({
            node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
            requestTimeout: 30000,
            maxRetries: 3
        });

        const health = await client.cluster.health();
        logger.info('✓ Connected to Elasticsearch', {status: health.status});
        console.log('✅ Connected to Elasticsearch');

        await createProductsIndex();

        return client;
    } catch (error) {
        logger.error('Failed to connect to Elasticsearch', {error: error.message});
        console.error('❌ Failed to connect to Elasticsearch:', error.message);
        return null;
    }
};

const createProductsIndex = async () => {
    try {
        const indexExists = await client.indices.exists({index: 'products'});

        if (!indexExists) {
            await client.indices.create({
                index: 'products',
                body: {
                    settings: {
                        number_of_shards: 1,
                        number_of_replicas: 0,
                        analysis: {
                            analyzer: {
                                custom_text_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'standard',
                                    filter: ['lowercase', 'asciifolding']
                                }
                            }
                        }
                    },
                    mappings: {
                        properties: {
                            id: {type: 'integer'},
                            name: {
                                type: 'text',
                                analyzer: 'custom_text_analyzer',
                                fields: {
                                    keyword: {type: 'keyword'}
                                }
                            },
                            description: {
                                type: 'text',
                                analyzer: 'custom_text_analyzer'
                            },
                            price: {type: 'float'},
                            quantity: {type: 'integer'},
                            current_quantity: {type: 'integer'},
                            category_id: {type: 'integer'},
                            category_name: {
                                type: 'keyword',
                                fields: {
                                    text: {type: 'text'}
                                }
                            },
                            brand_id: {type: 'integer'},
                            brand_name: {
                                type: 'keyword',
                                fields: {
                                    text: {type: 'text'}
                                }
                            },
                            gender_id: {type: 'integer'},
                            gender_name: {type: 'keyword'},
                            color_id: {type: 'integer'},
                            color_name: {type: 'keyword'},
                            size_id: {type: 'integer'},
                            size_name: {type: 'keyword'},
                            image_url: {type: 'keyword', index: false},
                            is_active: {type: 'boolean'},
                            created_at: {type: 'date'},
                            updated_at: {type: 'date'}
                        }
                    }
                }
            });

            logger.info('✓ Products index created in Elasticsearch');
            console.log('✅ Products index created');
        } else {
            logger.info('Products index already exists');
        }
    } catch (error) {
        logger.error('Failed to create products index', {error: error.message});
        throw error;
    }
};

const getClient = () => {
    if (!client) {
        throw new Error('Elasticsearch client not initialized');
    }
    return client;
};

module.exports = {
    connectElasticsearch,
    getClient,
    createProductsIndex
};