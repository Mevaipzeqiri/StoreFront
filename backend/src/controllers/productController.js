const productService = require("../services/productService");
const {addHATEOAS, productLinks, paginationLinks} = require("../utils/hateoas");

exports.getAllProducts = async (req, res) => {
    try {
        const {page = 1, limit = 10, is_active} = req.query;
        const result = await productService.getAllProducts(is_active, page, limit);

        const productsWithLinks = result.data.map(product =>
            addHATEOAS(product, productLinks(req, product.id))
        );

        res.json({
            success: true,
            data: productsWithLinks,
            pagination: result.pagination,
            _links: paginationLinks(req, page, limit, result.pagination.total)
        });
    } catch (error) {
        console.error("Get all products error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving products",
            error: error.message,
        });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const result = await productService.searchProducts(req.query, page, limit);

        const productsWithLinks = result.data.map(product =>
            addHATEOAS(product, productLinks(req, product.id))
        );

        res.json({
            success: true,
            data: productsWithLinks,
            filters: result.filters,
            pagination: result.pagination,
            _links: paginationLinks(req, page, limit, result.pagination.total)
        });
    } catch (error) {
        console.error("Search products error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error searching products",
            error: error.message,
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await productService.getProductById(id);

        res.json({
            success: true,
            data: addHATEOAS(data, productLinks(req, id))
        });
    } catch (error) {
        console.error("Get product by ID error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving product",
            error: error.message,
        });
    }
};

exports.getProductQuantity = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await productService.getProductQuantity(id);

        res.json({
            success: true,
            data: addHATEOAS(data, productLinks(req, id))
        });
    } catch (error) {
        console.error("Get product quantity error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving product quantity",
            error: error.message,
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const data = await productService.createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: addHATEOAS(data, productLinks(req, data.id))
        });
    } catch (error) {
        console.error("Create product error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error creating product",
            error: error.message,
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await productService.updateProduct(id, req.body);

        res.json({
            success: true,
            message: "Product updated successfully",
            data: addHATEOAS(data, productLinks(req, id))
        });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating product",
            error: error.message,
        });
    }
};

exports.updateProductStock = async (req, res) => {
    try {
        const {id} = req.params;
        const {quantity} = req.body;
        const data = await productService.updateProductStock(id, quantity);

        res.json({
            success: true,
            message: "Product stock updated successfully",
            data: addHATEOAS(data, productLinks(req, id))
        });
    } catch (error) {
        console.error("Update product stock error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating product stock",
            error: error.message,
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        await productService.deleteProduct(id);

        res.json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deleting product",
            error: error.message,
        });
    }
};