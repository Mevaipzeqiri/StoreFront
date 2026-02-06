const refDataService = require("../services/referenceDataService");

const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// ============ CATEGORIES ============

exports.getAllCategories = async (req, res) => {
    try {
        const data = await refDataService.getAllCategories();
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/categories`, method: 'GET'},
                create: {href: `${baseUrl}/api/v1/reference/categories`, method: 'POST'}
            }
        });
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving categories",
            error: error.message,
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const {name, description} = req.body;
        const data = await refDataService.createCategory(name, description);
        const baseUrl = getBaseUrl(req);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/categories/${data.id}`, method: 'GET'},
                update: {href: `${baseUrl}/api/v1/reference/categories/${data.id}`, method: 'PUT'},
                delete: {href: `${baseUrl}/api/v1/reference/categories/${data.id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/categories`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Category name already exists",
            });
        }
        console.error("Create category error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error creating category",
            error: error.message,
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description} = req.body;
        const data = await refDataService.updateCategory(id, name, description);
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            message: "Category updated successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/categories/${id}`, method: 'GET'},
                delete: {href: `${baseUrl}/api/v1/reference/categories/${id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/categories`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Category name already exists",
            });
        }
        console.error("Update category error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating category",
            error: error.message,
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const {id} = req.params;
        await refDataService.deleteCategory(id);

        res.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Delete category error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deleting category",
            error: error.message,
        });
    }
};

// ============ BRANDS ============

exports.getAllBrands = async (req, res) => {
    try {
        const data = await refDataService.getAllBrands();
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/brands`, method: 'GET'},
                create: {href: `${baseUrl}/api/v1/reference/brands`, method: 'POST'}
            }
        });
    } catch (error) {
        console.error("Get brands error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving brands",
            error: error.message,
        });
    }
};

exports.createBrand = async (req, res) => {
    try {
        const {name, description} = req.body;
        const data = await refDataService.createBrand(name, description);
        const baseUrl = getBaseUrl(req);

        res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/brands/${data.id}`, method: 'GET'},
                update: {href: `${baseUrl}/api/v1/reference/brands/${data.id}`, method: 'PUT'},
                delete: {href: `${baseUrl}/api/v1/reference/brands/${data.id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/brands`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Brand name already exists",
            });
        }
        console.error("Create brand error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error creating brand",
            error: error.message,
        });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description} = req.body;
        const data = await refDataService.updateBrand(id, name, description);
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            message: "Brand updated successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/brands/${id}`, method: 'GET'},
                delete: {href: `${baseUrl}/api/v1/reference/brands/${id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/brands`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Brand name already exists",
            });
        }
        console.error("Update brand error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating brand",
            error: error.message,
        });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const {id} = req.params;
        await refDataService.deleteBrand(id);

        res.json({
            success: true,
            message: "Brand deleted successfully",
        });
    } catch (error) {
        console.error("Delete brand error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deleting brand",
            error: error.message,
        });
    }
};

// ============ COLORS ============

exports.getAllColors = async (req, res) => {
    try {
        const data = await refDataService.getAllColors();
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/colors`, method: 'GET'},
                create: {href: `${baseUrl}/api/v1/reference/colors`, method: 'POST'}
            }
        });
    } catch (error) {
        console.error("Get colors error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving colors",
            error: error.message,
        });
    }
};

exports.createColor = async (req, res) => {
    try {
        const {name, hex_code} = req.body;
        const data = await refDataService.createColor(name, hex_code);
        const baseUrl = getBaseUrl(req);

        res.status(201).json({
            success: true,
            message: "Color created successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/colors/${data.id}`, method: 'GET'},
                update: {href: `${baseUrl}/api/v1/reference/colors/${data.id}`, method: 'PUT'},
                delete: {href: `${baseUrl}/api/v1/reference/colors/${data.id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/colors`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Color name already exists",
            });
        }
        console.error("Create color error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error creating color",
            error: error.message,
        });
    }
};

exports.updateColor = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, hex_code} = req.body;
        const data = await refDataService.updateColor(id, name, hex_code);
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            message: "Color updated successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/colors/${id}`, method: 'GET'},
                delete: {href: `${baseUrl}/api/v1/reference/colors/${id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/colors`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Color name already exists",
            });
        }
        console.error("Update color error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating color",
            error: error.message,
        });
    }
};

exports.deleteColor = async (req, res) => {
    try {
        const {id} = req.params;
        await refDataService.deleteColor(id);

        res.json({
            success: true,
            message: "Color deleted successfully",
        });
    } catch (error) {
        console.error("Delete color error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deleting color",
            error: error.message,
        });
    }
};

// ============ SIZES ============

exports.getAllSizes = async (req, res) => {
    try {
        const data = await refDataService.getAllSizes();
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/sizes`, method: 'GET'},
                create: {href: `${baseUrl}/api/v1/reference/sizes`, method: 'POST'}
            }
        });
    } catch (error) {
        console.error("Get sizes error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving sizes",
            error: error.message,
        });
    }
};

exports.createSize = async (req, res) => {
    try {
        const {name, description, sort_order} = req.body;
        const data = await refDataService.createSize(name, description, sort_order);
        const baseUrl = getBaseUrl(req);

        res.status(201).json({
            success: true,
            message: "Size created successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/sizes/${data.id}`, method: 'GET'},
                update: {href: `${baseUrl}/api/v1/reference/sizes/${data.id}`, method: 'PUT'},
                delete: {href: `${baseUrl}/api/v1/reference/sizes/${data.id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/sizes`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Size name already exists",
            });
        }
        console.error("Create size error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error creating size",
            error: error.message,
        });
    }
};

exports.updateSize = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description, sort_order} = req.body;
        const data = await refDataService.updateSize(
            id,
            name,
            description,
            sort_order
        );
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            message: "Size updated successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/sizes/${id}`, method: 'GET'},
                delete: {href: `${baseUrl}/api/v1/reference/sizes/${id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/sizes`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Size name already exists",
            });
        }
        console.error("Update size error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating size",
            error: error.message,
        });
    }
};

exports.deleteSize = async (req, res) => {
    try {
        const {id} = req.params;
        await refDataService.deleteSize(id);

        res.json({
            success: true,
            message: "Size deleted successfully",
        });
    } catch (error) {
        console.error("Delete size error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deleting size",
            error: error.message,
        });
    }
};

// ============ GENDERS ============

exports.getAllGenders = async (req, res) => {
    try {
        const data = await refDataService.getAllGenders();
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/genders`, method: 'GET'},
                create: {href: `${baseUrl}/api/v1/reference/genders`, method: 'POST'}
            }
        });
    } catch (error) {
        console.error("Get genders error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving genders",
            error: error.message,
        });
    }
};

exports.createGender = async (req, res) => {
    try {
        const {name, description} = req.body;
        const data = await refDataService.createGender(name, description);
        const baseUrl = getBaseUrl(req);

        res.status(201).json({
            success: true,
            message: "Gender created successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/genders/${data.id}`, method: 'GET'},
                update: {href: `${baseUrl}/api/v1/reference/genders/${data.id}`, method: 'PUT'},
                delete: {href: `${baseUrl}/api/v1/reference/genders/${data.id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/genders`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Gender name already exists",
            });
        }
        console.error("Create gender error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error creating gender",
            error: error.message,
        });
    }
};

exports.updateGender = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description} = req.body;
        const data = await refDataService.updateGender(id, name, description);
        const baseUrl = getBaseUrl(req);

        res.json({
            success: true,
            message: "Gender updated successfully",
            data,
            _links: {
                self: {href: `${baseUrl}/api/v1/reference/genders/${id}`, method: 'GET'},
                delete: {href: `${baseUrl}/api/v1/reference/genders/${id}`, method: 'DELETE'},
                all: {href: `${baseUrl}/api/v1/reference/genders`, method: 'GET'}
            }
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                success: false,
                message: "Gender name already exists",
            });
        }
        console.error("Update gender error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating gender",
            error: error.message,
        });
    }
};

exports.deleteGender = async (req, res) => {
    try {
        const {id} = req.params;
        await refDataService.deleteGender(id);

        res.json({
            success: true,
            message: "Gender deleted successfully",
        });
    } catch (error) {
        console.error("Delete gender error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deleting gender",
            error: error.message,
        });
    }
};