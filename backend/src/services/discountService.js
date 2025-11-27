// src/services/discountService.js
const db = require("../config/database");

exports.getAllDiscounts = async (is_active, page, limit) => {
    const offset = (page - 1) * limit;

    let queryText = `
        SELECT d.*, 
               p.name as product_name,
               p.price as product_price,
               u.username as created_by_username
        FROM discounts d
        LEFT JOIN products p ON d.product_id = p.id
        LEFT JOIN users u ON d.created_by = u.id
    `;

    const queryParams = [];
    if (is_active !== undefined) {
        queryText += " WHERE d.is_active = $1";
        queryParams.push(is_active === "true");
    }

    queryText +=
        " ORDER BY d.created_at DESC LIMIT $" +
        (queryParams.length + 1) +
        " OFFSET $" +
        (queryParams.length + 2);
    queryParams.push(limit, offset);

    const result = await db.query(queryText, queryParams);

    let countQuery = "SELECT COUNT(*) FROM discounts";
    if (is_active !== undefined) {
        countQuery += " WHERE is_active = $1";
        const countResult = await db.query(countQuery, [is_active === "true"]);
        var totalCount = parseInt(countResult.rows[0].count);
    } else {
        const countResult = await db.query(countQuery);
        var totalCount = parseInt(countResult.rows[0].count);
    }

    return {
        data: result.rows,
        pagination: {
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / limit),
        },
    };
};

exports.getDiscountById = async (id) => {
    const result = await db.query(
        `SELECT d.*, 
                p.name as product_name,
                p.price as product_price,
                u.username as created_by_username
         FROM discounts d
         LEFT JOIN products p ON d.product_id = p.id
         LEFT JOIN users u ON d.created_by = u.id
         WHERE d.id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Discount not found" };
    }

    return result.rows[0];
};

exports.getProductDiscounts = async (productId, is_active) => {
    let queryText = `
        SELECT d.*, 
               u.username as created_by_username
        FROM discounts d
        LEFT JOIN users u ON d.created_by = u.id
        WHERE d.product_id = $1
    `;

    const queryParams = [productId];

    if (is_active !== undefined) {
        queryText += " AND d.is_active = $2";
        queryParams.push(is_active === "true");
    }

    queryText += " ORDER BY d.created_at DESC";

    const result = await db.query(queryText, queryParams);

    return result.rows;
};

exports.applyDiscount = async (discountData, userId) => {
    const {
        product_id,
        discount_percentage,
        discount_amount,
        start_date,
        end_date,
    } = discountData;

    const productCheck = await db.query(
        "SELECT id, name FROM products WHERE id = $1",
        [product_id]
    );
    if (productCheck.rows.length === 0) {
        throw { status: 404, message: "Product not found" };
    }

    if (discount_percentage && discount_amount) {
        throw {
            status: 400,
            message: "Provide either discount_percentage or discount_amount, not both",
        };
    }

    if (!discount_percentage && !discount_amount) {
        throw {
            status: 400,
            message: "Either discount_percentage or discount_amount is required",
        };
    }

    if (new Date(start_date) >= new Date(end_date)) {
        throw { status: 400, message: "Start date must be before end date" };
    }

    const result = await db.query(
        `INSERT INTO discounts 
         (product_id, discount_percentage, discount_amount, start_date, end_date, is_active, created_by)
         VALUES ($1, $2, $3, $4, $5, true, $6)
         RETURNING *`,
        [
            product_id,
            discount_percentage,
            discount_amount,
            start_date,
            end_date,
            userId,
        ]
    );

    return result.rows[0];
};

exports.updateDiscount = async (id, discountData) => {
    const {
        discount_percentage,
        discount_amount,
        start_date,
        end_date,
        is_active,
    } = discountData;

    const checkDiscount = await db.query(
        "SELECT id FROM discounts WHERE id = $1",
        [id]
    );
    if (checkDiscount.rows.length === 0) {
        throw { status: 404, message: "Discount not found" };
    }

    if (discount_percentage && discount_amount) {
        throw {
            status: 400,
            message: "Provide either discount_percentage or discount_amount, not both",
        };
    }

    if (start_date && end_date && new Date(start_date) >= new Date(end_date)) {
        throw { status: 400, message: "Start date must be before end date" };
    }

    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (discount_percentage !== undefined) {
        updates.push(`discount_percentage = $${paramCounter}`);
        values.push(discount_percentage);
        paramCounter++;
        updates.push(`discount_amount = NULL`);
    }
    if (discount_amount !== undefined) {
        updates.push(`discount_amount = $${paramCounter}`);
        values.push(discount_amount);
        paramCounter++;
        updates.push(`discount_percentage = NULL`);
    }
    if (start_date !== undefined) {
        updates.push(`start_date = $${paramCounter}`);
        values.push(start_date);
        paramCounter++;
    }
    if (end_date !== undefined) {
        updates.push(`end_date = $${paramCounter}`);
        values.push(end_date);
        paramCounter++;
    }
    if (is_active !== undefined) {
        updates.push(`is_active = $${paramCounter}`);
        values.push(is_active);
        paramCounter++;
    }

    values.push(id);

    const query = `UPDATE discounts SET ${updates.join(
        ", "
    )} WHERE id = $${paramCounter} RETURNING *`;
    const result = await db.query(query, values);

    return result.rows[0];
};

exports.deactivateDiscount = async (id) => {
    const result = await db.query(
        `UPDATE discounts 
         SET is_active = false 
         WHERE id = $1 
         RETURNING *`,
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Discount not found" };
    }

    return result.rows[0];
};

exports.deleteDiscount = async (id) => {
    const result = await db.query(
        "DELETE FROM discounts WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Discount not found" };
    }
};