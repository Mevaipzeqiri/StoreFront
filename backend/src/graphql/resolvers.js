const productService = require('../services/productService');
const referenceDataService = require('../services/referenceDataService');
const {PubSub} = require('graphql-subscriptions');
const {
    AuthenticationError,
    AuthorizationError,
    ValidationError,
    NotFoundError,
    InternalServerError
} = require('./errors');

const pubsub = new PubSub();

const PRODUCT_CREATED = 'PRODUCT_CREATED';
const PRODUCT_UPDATED = 'PRODUCT_UPDATED';
const PRODUCT_DELETED = 'PRODUCT_DELETED';
const STOCK_UPDATED = 'STOCK_UPDATED';

const resolvers = {
    Query: {
        products: async (_, {page = 1, limit = 10, is_active}) => {
            try {
                if (page < 1) {
                    throw new ValidationError('Invalid pagination', {
                        page: 'Page must be greater than 0'
                    });
                }
                if (limit < 1 || limit > 100) {
                    throw new ValidationError('Invalid pagination', {
                        limit: 'Limit must be between 1 and 100'
                    });
                }

                return await productService.getAllProducts(
                    is_active !== undefined ? String(is_active) : undefined,
                    page,
                    limit
                );
            } catch (error) {
                if (error instanceof ValidationError) throw error;
                throw new InternalServerError('Failed to fetch products', {
                    originalError: error.message
                });
            }
        },

        product: async (_, {id}) => {
            try {
                if (!id || id < 1) {
                    throw new ValidationError('Invalid product ID', {
                        id: 'Product ID must be a positive integer'
                    });
                }

                const product = await productService.getProductById(id);
                return product;
            } catch (error) {
                if (error.status === 404) {
                    throw new NotFoundError('Product', id);
                }
                if (error instanceof ValidationError) throw error;
                throw new InternalServerError('Failed to fetch product', {
                    productId: id,
                    originalError: error.message
                });
            }
        },

        searchProducts: async (_, args) => {
            try {
                const {page = 1, limit = 10, price_min, price_max, ...filters} = args;

                if (page < 1 || limit < 1 || limit > 100) {
                    throw new ValidationError('Invalid pagination parameters');
                }

                if (price_min !== undefined && price_min < 0) {
                    throw new ValidationError('Invalid price range', {
                        price_min: 'Minimum price cannot be negative'
                    });
                }
                if (price_max !== undefined && price_max < 0) {
                    throw new ValidationError('Invalid price range', {
                        price_max: 'Maximum price cannot be negative'
                    });
                }
                if (price_min !== undefined && price_max !== undefined && price_min > price_max) {
                    throw new ValidationError('Invalid price range', {
                        priceRange: 'Minimum price cannot be greater than maximum price'
                    });
                }

                return await productService.searchProducts(
                    {...filters, price_min, price_max},
                    page,
                    limit
                );
            } catch (error) {
                if (error instanceof ValidationError) throw error;
                throw new InternalServerError('Search failed', {
                    filters: args,
                    originalError: error.message
                });
            }
        },

        categories: async () => {
            try {
                return await referenceDataService.getAllCategories();
            } catch (error) {
                throw new InternalServerError('Failed to fetch categories', {
                    originalError: error.message
                });
            }
        },

        brands: async () => {
            try {
                return await referenceDataService.getAllBrands();
            } catch (error) {
                throw new InternalServerError('Failed to fetch brands', {
                    originalError: error.message
                });
            }
        },

        colors: async () => {
            try {
                return await referenceDataService.getAllColors();
            } catch (error) {
                throw new InternalServerError('Failed to fetch colors', {
                    originalError: error.message
                });
            }
        },

        sizes: async () => {
            try {
                return await referenceDataService.getAllSizes();
            } catch (error) {
                throw new InternalServerError('Failed to fetch sizes', {
                    originalError: error.message
                });
            }
        },

        genders: async () => {
            try {
                return await referenceDataService.getAllGenders();
            } catch (error) {
                throw new InternalServerError('Failed to fetch genders', {
                    originalError: error.message
                });
            }
        },
    },

    Mutation: {
        createProduct: async (_, {input}, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to create products');
                }

                const errors = {};
                if (!input.name || input.name.trim().length === 0) {
                    errors.name = 'Product name is required';
                }
                if (input.price === undefined || input.price < 0) {
                    errors.price = 'Price must be a positive number';
                }
                if (input.quantity === undefined || input.quantity < 0) {
                    errors.quantity = 'Quantity must be a non-negative integer';
                }

                if (Object.keys(errors).length > 0) {
                    throw new ValidationError('Invalid product data', errors);
                }

                const product = await productService.createProduct(input);

                pubsub.publish(PRODUCT_CREATED, {productCreated: product});

                return product;
            } catch (error) {
                if (error instanceof AuthenticationError || error instanceof ValidationError) {
                    throw error;
                }
                throw new InternalServerError('Failed to create product', {
                    input,
                    originalError: error.message
                });
            }
        },

        updateProduct: async (_, {id, input}, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to update products');
                }

                if (!id || id < 1) {
                    throw new ValidationError('Invalid product ID', {
                        id: 'Product ID must be a positive integer'
                    });
                }

                const errors = {};
                if (input.name !== undefined && input.name.trim().length === 0) {
                    errors.name = 'Product name cannot be empty';
                }
                if (input.price !== undefined && input.price < 0) {
                    errors.price = 'Price must be a positive number';
                }
                if (input.quantity !== undefined && input.quantity < 0) {
                    errors.quantity = 'Quantity must be a non-negative integer';
                }

                if (Object.keys(errors).length > 0) {
                    throw new ValidationError('Invalid product data', errors);
                }

                const product = await productService.updateProduct(id, input);

                pubsub.publish(PRODUCT_UPDATED, {productUpdated: product});

                return product;
            } catch (error) {
                if (error instanceof AuthenticationError || error instanceof ValidationError) {
                    throw error;
                }
                if (error.status === 404) {
                    throw new NotFoundError('Product', id);
                }
                throw new InternalServerError('Failed to update product', {
                    productId: id,
                    input,
                    originalError: error.message
                });
            }
        },

        deleteProduct: async (_, {id}, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to delete products');
                }

                if (context.user.role !== 'admin') {
                    throw new AuthorizationError('Only administrators can delete products', {
                        requiredRole: 'admin',
                        userRole: context.user.role
                    });
                }

                if (!id || id < 1) {
                    throw new ValidationError('Invalid product ID', {
                        id: 'Product ID must be a positive integer'
                    });
                }

                await productService.deleteProduct(id);

                pubsub.publish(PRODUCT_DELETED, {productDeleted: id});

                return {
                    success: true,
                    message: 'Product deleted successfully'
                };
            } catch (error) {
                if (error instanceof AuthenticationError ||
                    error instanceof AuthorizationError ||
                    error instanceof ValidationError) {
                    throw error;
                }
                if (error.status === 404) {
                    throw new NotFoundError('Product', id);
                }
                throw new InternalServerError('Failed to delete product', {
                    productId: id,
                    originalError: error.message
                });
            }
        },

        updateProductStock: async (_, {id, quantity}, context) => {
            try {
                if (!context.user) {
                    throw new AuthenticationError('You must be logged in to update stock');
                }

                const errors = {};
                if (!id || id < 1) {
                    errors.id = 'Product ID must be a positive integer';
                }
                if (quantity === undefined || quantity < 0) {
                    errors.quantity = 'Quantity must be a non-negative integer';
                }

                if (Object.keys(errors).length > 0) {
                    throw new ValidationError('Invalid stock update data', errors);
                }

                const oldProduct = await productService.getProductById(id);
                const oldQuantity = oldProduct.current_quantity;

                const product = await productService.updateProductStock(id, quantity);

                pubsub.publish(STOCK_UPDATED, {
                    stockUpdated: {
                        product_id: id,
                        product_name: product.name,
                        old_quantity: oldQuantity,
                        new_quantity: quantity,
                        updated_at: new Date().toISOString()
                    }
                });

                return product;
            } catch (error) {
                if (error instanceof AuthenticationError || error instanceof ValidationError) {
                    throw error;
                }
                if (error.status === 404) {
                    throw new NotFoundError('Product', id);
                }
                throw new InternalServerError('Failed to update stock', {
                    productId: id,
                    quantity,
                    originalError: error.message
                });
            }
        },
    },

    Subscription: {
        productCreated: {
            subscribe: () => pubsub.asyncIterator([PRODUCT_CREATED])
        },

        productUpdated: {
            subscribe: () => pubsub.asyncIterator([PRODUCT_UPDATED])
        },

        productDeleted: {
            subscribe: () => pubsub.asyncIterator([PRODUCT_DELETED])
        },

        stockUpdated: {
            subscribe: () => pubsub.asyncIterator([STOCK_UPDATED])
        },
    },
};

module.exports = resolvers;