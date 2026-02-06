const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Web Store API',
            version: '1.0.0',
            description: 'E-commerce Web Store API with comprehensive product, order, and user management',
            contact: {
                name: 'API Support',
                email: 'support@webstore.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Development server'
            },
            {
                url: 'http://localhost:3000/api',
                description: 'Legacy endpoints (backward compatibility)'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error message'
                        },
                        error: {
                            type: 'string',
                            example: 'Detailed error information'
                        }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            example: 'Nike Air Max'
                        },
                        description: {
                            type: 'string',
                            example: 'Comfortable running shoes'
                        },
                        price: {
                            type: 'number',
                            format: 'decimal',
                            example: 120.00
                        },
                        quantity: {
                            type: 'integer',
                            example: 50
                        },
                        current_quantity: {
                            type: 'integer',
                            example: 45
                        },
                        category_id: {
                            type: 'integer',
                            example: 1
                        },
                        category_name: {
                            type: 'string',
                            example: 'Shoes'
                        },
                        brand_id: {
                            type: 'integer',
                            example: 1
                        },
                        brand_name: {
                            type: 'string',
                            example: 'Nike'
                        },
                        gender_id: {
                            type: 'integer',
                            example: 1
                        },
                        gender_name: {
                            type: 'string',
                            example: 'Men'
                        },
                        color_id: {
                            type: 'integer',
                            example: 1
                        },
                        color_name: {
                            type: 'string',
                            example: 'Black'
                        },
                        size_id: {
                            type: 'integer',
                            example: 3
                        },
                        size_name: {
                            type: 'string',
                            example: 'M'
                        },
                        image_url: {
                            type: 'string',
                            example: 'https://example.com/image.jpg'
                        },
                        is_active: {
                            type: 'boolean',
                            example: true
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        client_id: {
                            type: 'integer',
                            example: 1
                        },
                        order_number: {
                            type: 'string',
                            example: 'ORD-1234567890-123'
                        },
                        order_date: {
                            type: 'string',
                            format: 'date-time'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
                            example: 'pending'
                        },
                        total_amount: {
                            type: 'number',
                            format: 'decimal',
                            example: 250.00
                        },
                        shipping_address: {
                            type: 'string',
                            example: '123 Main St, City, Country'
                        },
                        notes: {
                            type: 'string',
                            example: 'Please deliver between 9-5'
                        }
                    }
                },
                Client: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        first_name: {
                            type: 'string',
                            example: 'John'
                        },
                        last_name: {
                            type: 'string',
                            example: 'Doe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john.doe@example.com'
                        },
                        phone: {
                            type: 'string',
                            example: '+1234567890'
                        },
                        address: {
                            type: 'string',
                            example: '123 Main St'
                        },
                        city: {
                            type: 'string',
                            example: 'New York'
                        },
                        postal_code: {
                            type: 'string',
                            example: '10001'
                        },
                        country: {
                            type: 'string',
                            example: 'USA'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        username: {
                            type: 'string',
                            example: 'johndoe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'john@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['admin', 'advanced_user', 'simple_user'],
                            example: 'simple_user'
                        },
                        is_active: {
                            type: 'boolean',
                            example: true
                        }
                    }
                },
                Discount: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        product_id: {
                            type: 'integer',
                            example: 1
                        },
                        discount_percentage: {
                            type: 'number',
                            format: 'decimal',
                            example: 15.00
                        },
                        discount_amount: {
                            type: 'number',
                            format: 'decimal',
                            example: 10.00
                        },
                        start_date: {
                            type: 'string',
                            format: 'date-time'
                        },
                        end_date: {
                            type: 'string',
                            format: 'date-time'
                        },
                        is_active: {
                            type: 'boolean',
                            example: true
                        }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            example: 'Shoes'
                        },
                        description: {
                            type: 'string',
                            example: 'Footwear category'
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'integer',
                            example: 100
                        },
                        page: {
                            type: 'integer',
                            example: 1
                        },
                        limit: {
                            type: 'integer',
                            example: 10
                        },
                        totalPages: {
                            type: 'integer',
                            example: 10
                        }
                    }
                },
                Links: {
                    type: 'object',
                    properties: {
                        self: {
                            type: 'object',
                            properties: {
                                href: {
                                    type: 'string',
                                    example: 'http://localhost:3000/api/v1/products/1'
                                },
                                method: {
                                    type: 'string',
                                    example: 'GET'
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/routes/v1/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;