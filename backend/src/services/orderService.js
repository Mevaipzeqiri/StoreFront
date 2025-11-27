// src/services/orderService.js
const db = require("../config/database");

exports.getAllOrders = async (status, page, limit) => {
    const offset = (page - 1) * limit;

    let queryText = `
        SELECT o.*, 
               c.first_name, 
               c.last_name, 
               c.email as client_email,
               u.username as created_by_username
        FROM orders o
        LEFT JOIN clients c ON o.client_id = c.id
        LEFT JOIN users u ON o.created_by = u.id
    `;

    const queryParams = [];
    if (status) {
        queryText += " WHERE o.status = $1";
        queryParams.push(status);
    }

    queryText +=
        " ORDER BY o.order_date DESC LIMIT $" +
        (queryParams.length + 1) +
        " OFFSET $" +
        (queryParams.length + 2);
    queryParams.push(limit, offset);

    const result = await db.query(queryText, queryParams);

    let countQuery = "SELECT COUNT(*) FROM orders";
    if (status) {
        countQuery += " WHERE status = $1";
        const countResult = await db.query(countQuery, [status]);
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

exports.getOrderById = async (id) => {
    const orderResult = await db.query(
        `SELECT o.*, 
                c.first_name, 
                c.last_name, 
                c.email as client_email,
                c.phone,
                u.username as created_by_username
         FROM orders o
         LEFT JOIN clients c ON o.client_id = c.id
         LEFT JOIN users u ON o.created_by = u.id
         WHERE o.id = $1`,
        [id]
    );

    if (orderResult.rows.length === 0) {
        throw { status: 404, message: "Order not found" };
    }

    const itemsResult = await db.query(
        `SELECT oi.*, 
                p.name as product_name,
                p.image_url as product_image
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [id]
    );

    const order = orderResult.rows[0];
    order.items = itemsResult.rows;

    return order;
};

exports.getOrdersByClient = async (clientId, page, limit) => {
    const offset = (page - 1) * limit;

    const result = await db.query(
        `SELECT o.*, 
                c.first_name, 
                c.last_name
         FROM orders o
         LEFT JOIN clients c ON o.client_id = c.id
         WHERE o.client_id = $1
         ORDER BY o.order_date DESC
         LIMIT $2 OFFSET $3`,
        [clientId, limit, offset]
    );

    const countResult = await db.query(
        "SELECT COUNT(*) FROM orders WHERE client_id = $1",
        [clientId]
    );
    const totalCount = parseInt(countResult.rows[0].count);

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

exports.createOrder = async (orderData, userId) => {
    const client = await db.pool.connect();

    try {
        const { client_id, items, shipping_address, notes } = orderData;

        await client.query("BEGIN");

        const clientCheck = await client.query(
            "SELECT id FROM clients WHERE id = $1",
            [client_id]
        );
        if (clientCheck.rows.length === 0) {
            await client.query("ROLLBACK");
            throw { status: 404, message: "Client not found" };
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const productResult = await client.query(
                `SELECT p.id, p.name, p.price, p.quantity,
                    (p.quantity - COALESCE((
                        SELECT SUM(oi.quantity) 
                        FROM order_items oi
                        JOIN orders o ON oi.order_id = o.id
                        WHERE oi.product_id = p.id 
                        AND o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
                    ), 0)) as current_quantity,
                    d.discount_percentage,
                    d.discount_amount
             FROM products p
             LEFT JOIN discounts d ON p.id = d.product_id 
                 AND d.is_active = true 
                 AND CURRENT_TIMESTAMP BETWEEN d.start_date AND d.end_date
             WHERE p.id = $1 AND p.is_active = true`,
                [item.product_id]
            );

            if (productResult.rows.length === 0) {
                await client.query("ROLLBACK");
                throw {
                    status: 404,
                    message: `Product with ID ${item.product_id} not found or inactive`,
                };
            }

            const product = productResult.rows[0];

            if (product.current_quantity < item.quantity) {
                await client.query("ROLLBACK");
                throw {
                    status: 400,
                    message: `Insufficient stock for product: ${product.name}. Available: ${product.current_quantity}, Requested: ${item.quantity}`,
                };
            }

            let unitPrice = parseFloat(product.price);
            let discountApplied = 0;

            if (product.discount_amount) {
                discountApplied = parseFloat(product.discount_amount);
                unitPrice = unitPrice - discountApplied;
            } else if (product.discount_percentage) {
                discountApplied =
                    unitPrice * (parseFloat(product.discount_percentage) / 100);
                unitPrice = unitPrice - discountApplied;
            }

            const subtotal = unitPrice * item.quantity;
            totalAmount += subtotal;

            orderItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: parseFloat(product.price),
                discount_applied: discountApplied,
                subtotal: subtotal,
            });
        }

        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const orderResult = await client.query(
            `INSERT INTO orders 
           (client_id, order_number, order_date, status, total_amount, shipping_address, notes, created_by)
           VALUES ($1, $2, CURRENT_TIMESTAMP, 'pending', $3, $4, $5, $6)
           RETURNING *`,
            [client_id, orderNumber, totalAmount, shipping_address, notes, userId]
        );

        const order = orderResult.rows[0];

        for (const item of orderItems) {
            await client.query(
                `INSERT INTO order_items 
               (order_id, product_id, quantity, unit_price, discount_applied, subtotal)
               VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    order.id,
                    item.product_id,
                    item.quantity,
                    item.unit_price,
                    item.discount_applied,
                    item.subtotal,
                ]
            );
        }

        await client.query("COMMIT");

        const completeOrder = await db.query(
            `SELECT o.*, 
                c.first_name, 
                c.last_name, 
                c.email as client_email
         FROM orders o
         LEFT JOIN clients c ON o.client_id = c.id
         WHERE o.id = $1`,
            [order.id]
        );

        const itemsResult = await db.query(
            `SELECT oi.*, 
                p.name as product_name
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
            [order.id]
        );

        const finalOrder = completeOrder.rows[0];
        finalOrder.items = itemsResult.rows;

        return finalOrder;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

exports.updateOrderStatus = async (id, status) => {
    const result = await db.query(
        `UPDATE orders 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [status, id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Order not found" };
    }

    return result.rows[0];
};

exports.cancelOrder = async (id) => {
    const orderCheck = await db.query("SELECT status FROM orders WHERE id = $1", [
        id,
    ]);

    if (orderCheck.rows.length === 0) {
        throw { status: 404, message: "Order not found" };
    }

    const currentStatus = orderCheck.rows[0].status;
    if (["shipped", "delivered", "cancelled"].includes(currentStatus)) {
        throw {
            status: 400,
            message: `Cannot cancel order with status: ${currentStatus}`,
        };
    }

    const result = await db.query(
        `UPDATE orders 
         SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};