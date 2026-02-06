const productService = require('../services/productService');
const referenceDataService = require('../services/referenceDataService');
const {PubSub} = require('graphql-subscriptions');

const pubsub = new PubSub();

// Subscription events
const PRODUCT_CREATED = 'PRODUCT_CREATED';
const PRODUCT_UPDATED = 'PRODUCT_UPDATED';
const PRODUCT_DELETED = 'PRODUCT_DELETED';
const STOCK_UPDATED = 'STOCK_UPDATED';

const resolvers = {
    Query: {
        products: async (_, {page = 1, limit = 10, is_active}) => {
            try {
                const result = await productService.getAllProducts(
                    is_active !== undefined ? String(is_active) : undefined,
                    page,
                    limit
                );
                return result;
            } catch (error) {
                throw new Error(`Failed to fetch products: ${error.message}`);
            }
        },

        product: async (_, {id}) => {
            try {
                const product = await productService.getProductById(id);
                return product;
            } catch (error) {
                throw new Error(`Product not found: ${error.message}`);
            }
        },

        searchProducts: async (_, args) => {
            try {
                const {page = 1, limit = 10, ...filters} = args;
                const result = await productService.searchProducts(filters, page, limit);
                return result;
            } catch (error) {
                throw new Error(`Search failed: ${error.message}`);
            }
        },

        categories: async () => {
            try {
                return await referenceDataService.getAllCategories();
            } catch (error) {
                throw new Error(`Failed to fetch categories: ${error.message}`);
            }
        },

        brands: async () => {
            try {
                return await referenceDataService.getAllBrands();
            } catch (error) {
                throw new Error(`Failed to fetch brands: ${error.message}`);
            }
        },

        colors: async () => {
            try {
                return await referenceDataService.getAllColors();
            } catch (error) {
                throw new Error(`Failed to fetch colors: ${error.message}`);
            }
        },

        sizes: async () => {
            try {
                return await referenceDataService.getAllSizes();
            } catch (error) {
                throw new Error(`Failed to fetch sizes: ${error.message}`);
            }
        },

        genders: async () => {
            try {
                return await referenceDataService.getAllGenders();
            } catch (error) {
                throw new Error(`Failed to fetch genders: ${error.message}`);
            }
        },
    },

    Mutation: {
        createProduct: async (_, {input}, context) => {
            try {
                // Check authentication
                if (!context.user) {
                    throw new Error('Authentication required');
                }

                const product = await productService.createProduct(input);

                // Publish subscription event
                pubsub.publish(PRODUCT_CREATED, {productCreated: product});

                return product;
            } catch (error) {
                throw new Error(`Failed to create product: ${error.message}`);
            }
        },

        updateProduct: async (_, {id, input}, context) => {
            try {
                // Check authentication
                if (!context.user) {
                    throw new Error('Authentication required');
                }

                const product = await productService.updateProduct(id, input);

                // Publish subscription event
                pubsub.publish(PRODUCT_UPDATED, {productUpdated: product});

                return product;
            } catch (error) {
                throw new Error(`Failed to update product: ${error.message}`);
            }
        },

        deleteProduct: async (_, {id}, context) => {
            try {
                // Check authentication and admin role
                if (!context.user) {
                    throw new Error('Authentication required');
                }
                if (context.user.role !== 'admin') {
                    throw new Error('Admin access required');
                }

                await productService.deleteProduct(id);

                // Publish subscription event
                pubsub.publish(PRODUCT_DELETED, {productDeleted: id});

                return {
                    success: true,
                    message: 'Product deleted successfully'
                };
            } catch (error) {
                throw new Error(`Failed to delete product: ${error.message}`);
            }
        },

        updateProductStock: async (_, {id, quantity}, context) => {
            try {
                // Check authentication
                if (!context.user) {
                    throw new Error('Authentication required');
                }

                // Get old quantity first
                const oldProduct = await productService.getProductById(id);
                const oldQuantity = oldProduct.current_quantity;

                const product = await productService.updateProductStock(id, quantity);

                // Publish subscription event
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
                throw new Error(`Failed to update stock: ${error.message}`);
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