// src/services/referenceDataService.js
const db = require("../config/database");

// ============ CATEGORIES ============

exports.getAllCategories = async () => {
    const result = await db.query("SELECT * FROM categories ORDER BY name");
    return result.rows;
};

exports.createCategory = async (name, description) => {
    const result = await db.query(
        "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
    );
    return result.rows[0];
};

exports.updateCategory = async (id, name, description) => {
    const result = await db.query(
        "UPDATE categories SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
        [name, description, id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Category not found" };
    }

    return result.rows[0];
};

exports.deleteCategory = async (id) => {
    const result = await db.query(
        "DELETE FROM categories WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Category not found" };
    }
};

// ============ BRANDS ============

exports.getAllBrands = async () => {
    const result = await db.query("SELECT * FROM brands ORDER BY name");
    return result.rows;
};

exports.createBrand = async (name, description) => {
    const result = await db.query(
        "INSERT INTO brands (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
    );
    return result.rows[0];
};

exports.updateBrand = async (id, name, description) => {
    const result = await db.query(
        "UPDATE brands SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
        [name, description, id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Brand not found" };
    }

    return result.rows[0];
};

exports.deleteBrand = async (id) => {
    const result = await db.query(
        "DELETE FROM brands WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Brand not found" };
    }
};

// ============ COLORS ============

exports.getAllColors = async () => {
    const result = await db.query("SELECT * FROM colors ORDER BY name");
    return result.rows;
};

exports.createColor = async (name, hex_code) => {
    const result = await db.query(
        "INSERT INTO colors (name, hex_code) VALUES ($1, $2) RETURNING *",
        [name, hex_code]
    );
    return result.rows[0];
};

exports.updateColor = async (id, name, hex_code) => {
    const result = await db.query(
        "UPDATE colors SET name = $1, hex_code = $2 WHERE id = $3 RETURNING *",
        [name, hex_code, id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Color not found" };
    }

    return result.rows[0];
};

exports.deleteColor = async (id) => {
    const result = await db.query(
        "DELETE FROM colors WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Color not found" };
    }
};

// ============ SIZES ============

exports.getAllSizes = async () => {
    const result = await db.query(
        "SELECT * FROM sizes ORDER BY sort_order, name"
    );
    return result.rows;
};

exports.createSize = async (name, description, sort_order) => {
    const result = await db.query(
        "INSERT INTO sizes (name, description, sort_order) VALUES ($1, $2, $3) RETURNING *",
        [name, description, sort_order]
    );
    return result.rows[0];
};

exports.updateSize = async (id, name, description, sort_order) => {
    const result = await db.query(
        "UPDATE sizes SET name = $1, description = $2, sort_order = $3 WHERE id = $4 RETURNING *",
        [name, description, sort_order, id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Size not found" };
    }

    return result.rows[0];
};

exports.deleteSize = async (id) => {
    const result = await db.query(
        "DELETE FROM sizes WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Size not found" };
    }
};

// ============ GENDERS ============

exports.getAllGenders = async () => {
    const result = await db.query("SELECT * FROM genders ORDER BY name");
    return result.rows;
};

exports.createGender = async (name, description) => {
    const result = await db.query(
        "INSERT INTO genders (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
    );
    return result.rows[0];
};

exports.updateGender = async (id, name, description) => {
    const result = await db.query(
        "UPDATE genders SET name = $1, description = $2 WHERE id = $3 RETURNING *",
        [name, description, id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Gender not found" };
    }

    return result.rows[0];
};

exports.deleteGender = async (id) => {
    const result = await db.query(
        "DELETE FROM genders WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Gender not found" };
    }
};