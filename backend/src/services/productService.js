// src/services/productService.js
const db = require("../config/database");

exports.getAllProducts = async (is_active, page, limit) => {
    const offset = (page - 1) * limit;

    let queryText = `
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
    `;

    const queryParams = [];
    if (is_active !== undefined) {
        queryText += " WHERE p.is_active = $1";
        queryParams.push(is_active === "true");
    }

    queryText +=
        " ORDER BY p.created_at DESC LIMIT $" +
        (queryParams.length + 1) +
        " OFFSET $" +
        (queryParams.length + 2);
    queryParams.push(limit, offset);

    const result = await db.query(queryText, queryParams);

    let countQuery = "SELECT COUNT(*) FROM products";
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

exports.searchProducts = async (filters, page, limit) => {
    const {
        gender,
        category,
        brand,
        color,
        size,
        price_min,
        price_max,
        availability,
        search,
    } = filters;

    const offset = (page - 1) * limit;
    const queryParams = [];
    let paramCounter = 1;

    let queryText = `
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
        WHERE p.is_active = true
    `;

    if (gender) {
        queryText += ` AND g.name ILIKE $${paramCounter}`;
        queryParams.push(gender);
        paramCounter++;
    }

    if (category) {
        queryText += ` AND c.name ILIKE $${paramCounter}`;
        queryParams.push(category);
        paramCounter++;
    }

    if (brand) {
        queryText += ` AND b.name ILIKE $${paramCounter}`;
        queryParams.push(brand);
        paramCounter++;
    }

    if (color) {
        queryText += ` AND col.name ILIKE $${paramCounter}`;
        queryParams.push(color);
        paramCounter++;
    }

    if (size) {
        queryText += ` AND s.name ILIKE $${paramCounter}`;
        queryParams.push(size);
        paramCounter++;
    }

    if (price_min) {
        queryText += ` AND p.price >= $${paramCounter}`;
        queryParams.push(parseFloat(price_min));
        paramCounter++;
    }

    if (price_max) {
        queryText += ` AND p.price <= $${paramCounter}`;
        queryParams.push(parseFloat(price_max));
        paramCounter++;
    }

    if (search) {
        queryText += ` AND (p.name ILIKE $${paramCounter} OR p.description ILIKE $${paramCounter})`;
        queryParams.push(`%${search}%`);
        paramCounter++;
    }

    const finalQuery = `
        SELECT * FROM (${queryText}) as filtered_products
        ${
        availability
            ? `WHERE current_quantity ${
                availability === "in_stock" ? ">" : "<="
            } 0`
            : ""
    }
        ORDER BY created_at DESC
        LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
    `;

    queryParams.push(limit, offset);

    const result = await db.query(finalQuery, queryParams);

    const countParams = [];
    let countParamCounter = 1;

    let countQuery = `
        SELECT COUNT(*) FROM (
            SELECT p.id,
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
            WHERE p.is_active = true
    `;

    if (gender) {
        countQuery += ` AND g.name ILIKE $${countParamCounter}`;
        countParams.push(gender);
        countParamCounter++;
    }
    if (category) {
        countQuery += ` AND c.name ILIKE $${countParamCounter}`;
        countParams.push(category);
        countParamCounter++;
    }
    if (brand) {
        countQuery += ` AND b.name ILIKE $${countParamCounter}`;
        countParams.push(brand);
        countParamCounter++;
    }
    if (color) {
        countQuery += ` AND col.name ILIKE $${countParamCounter}`;
        countParams.push(color);
        countParamCounter++;
    }
    if (size) {
        countQuery += ` AND s.name ILIKE $${countParamCounter}`;
        countParams.push(size);
        countParamCounter++;
    }
    if (price_min) {
        countQuery += ` AND p.price >= $${countParamCounter}`;
        countParams.push(parseFloat(price_min));
        countParamCounter++;
    }
    if (price_max) {
        countQuery += ` AND p.price <= $${countParamCounter}`;
        countParams.push(parseFloat(price_max));
        countParamCounter++;
    }
    if (search) {
        countQuery += ` AND (p.name ILIKE $${countParamCounter} OR p.description ILIKE $${countParamCounter})`;
        countParams.push(`%${search}%`);
        countParamCounter++;
    }

    countQuery += `) as filtered ${
        availability
            ? `WHERE current_quantity ${availability === "in_stock" ? ">" : "<="} 0`
            : ""
    }`;

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    return {
        data: result.rows,
        filters: {
            gender,
            category,
            brand,
            color,
            size,
            price_min,
            price_max,
            availability,
            search,
        },
        pagination: {
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / limit),
        },
    };
};

exports.getProductById = async (id) => {
    const result = await db.query(
        `SELECT p.*, 
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
         WHERE p.id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Product not found" };
    }

    return result.rows[0];
};

exports.getProductQuantity = async (id) => {
    const result = await db.query(
        `SELECT 
            p.id as product_id,
            p.name,
            p.quantity as initial_quantity,
            COALESCE(SUM(oi.quantity), 0) as sold_quantity,
            (p.quantity - COALESCE(SUM(oi.quantity), 0)) as current_quantity
         FROM products p
         LEFT JOIN order_items oi ON p.id = oi.product_id
         LEFT JOIN orders o ON oi.order_id = o.id 
             AND o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
         WHERE p.id = $1
         GROUP BY p.id, p.name, p.quantity`,
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Product not found" };
    }

    return result.rows[0];
};

exports.createProduct = async (productData) => {
    const {
        name,
        description,
        price,
        quantity,
        category_id,
        brand_id,
        gender_id,
        color_id,
        size_id,
        image_url,
    } = productData;

    const result = await db.query(
        `INSERT INTO products 
         (name, description, price, quantity, category_id, brand_id, gender_id, color_id, size_id, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
            name,
            description,
            price,
            quantity,
            category_id,
            brand_id,
            gender_id,
            color_id,
            size_id,
            image_url,
        ]
    );

    return result.rows[0];
};

exports.updateProduct = async (id, productData) => {
    const {
        name,
        description,
        price,
        quantity,
        category_id,
        brand_id,
        gender_id,
        color_id,
        size_id,
        image_url,
        is_active,
    } = productData;

    const checkProduct = await db.query(
        "SELECT id FROM products WHERE id = $1",
        [id]
    );
    if (checkProduct.rows.length === 0) {
        throw { status: 404, message: "Product not found" };
    }

    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (name !== undefined) {
        updates.push(`name = $${paramCounter}`);
        values.push(name);
        paramCounter++;
    }
    if (description !== undefined) {
        updates.push(`description = $${paramCounter}`);
        values.push(description);
        paramCounter++;
    }
    if (price !== undefined) {
        updates.push(`price = $${paramCounter}`);
        values.push(price);
        paramCounter++;
    }
    if (quantity !== undefined) {
        updates.push(`quantity = $${paramCounter}`);
        values.push(quantity);
        paramCounter++;
    }
    if (category_id !== undefined) {
        updates.push(`category_id = $${paramCounter}`);
        values.push(category_id);
        paramCounter++;
    }
    if (brand_id !== undefined) {
        updates.push(`brand_id = $${paramCounter}`);
        values.push(brand_id);
        paramCounter++;
    }
    if (gender_id !== undefined) {
        updates.push(`gender_id = $${paramCounter}`);
        values.push(gender_id);
        paramCounter++;
    }
    if (color_id !== undefined) {
        updates.push(`color_id = $${paramCounter}`);
        values.push(color_id);
        paramCounter++;
    }
    if (size_id !== undefined) {
        updates.push(`size_id = $${paramCounter}`);
        values.push(size_id);
        paramCounter++;
    }
    if (image_url !== undefined) {
        updates.push(`image_url = $${paramCounter}`);
        values.push(image_url);
        paramCounter++;
    }
    if (is_active !== undefined) {
        updates.push(`is_active = $${paramCounter}`);
        values.push(is_active);
        paramCounter++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE products SET ${updates.join(
        ", "
    )} WHERE id = $${paramCounter} RETURNING *`;
    const result = await db.query(query, values);

    return result.rows[0];
};

exports.updateProductStock = async (id, quantity) => {
    const result = await db.query(
        `UPDATE products 
         SET quantity = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [quantity, id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Product not found" };
    }

    return result.rows[0];
};

exports.deleteProduct = async (id) => {
    const result = await db.query(
        "DELETE FROM products WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Product not found" };
    }
};