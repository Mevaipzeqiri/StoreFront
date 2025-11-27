// src/services/clientService.js
const db = require("../config/database");

exports.getAllClients = async (page, limit) => {
    const offset = (page - 1) * limit;

    const result = await db.query(
        `SELECT * FROM clients 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await db.query("SELECT COUNT(*) FROM clients");
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

exports.searchClients = async (query, page, limit) => {
    const offset = (page - 1) * limit;

    if (!query) {
        throw { status: 400, message: "Search query is required" };
    }

    const result = await db.query(
        `SELECT * FROM clients 
         WHERE first_name ILIKE $1 
            OR last_name ILIKE $1 
            OR email ILIKE $1 
            OR phone ILIKE $1
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [`%${query}%`, limit, offset]
    );

    const countResult = await db.query(
        `SELECT COUNT(*) FROM clients 
         WHERE first_name ILIKE $1 
            OR last_name ILIKE $1 
            OR email ILIKE $1 
            OR phone ILIKE $1`,
        [`%${query}%`]
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

exports.getClientById = async (id) => {
    const result = await db.query("SELECT * FROM clients WHERE id = $1", [id]);

    if (result.rows.length === 0) {
        throw { status: 404, message: "Client not found" };
    }

    const ordersResult = await db.query(
        `SELECT id, order_number, order_date, status, total_amount 
         FROM orders 
         WHERE client_id = $1 
         ORDER BY order_date DESC 
         LIMIT 10`,
        [id]
    );

    const client = result.rows[0];
    client.recent_orders = ordersResult.rows;

    return client;
};

exports.createClient = async (clientData) => {
    const {
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        postal_code,
        country,
    } = clientData;

    const existingClient = await db.query(
        "SELECT id FROM clients WHERE email = $1",
        [email]
    );
    if (existingClient.rows.length > 0) {
        throw { status: 400, message: "Client with this email already exists" };
    }

    const result = await db.query(
        `INSERT INTO clients 
         (first_name, last_name, email, phone, address, city, postal_code, country)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [first_name, last_name, email, phone, address, city, postal_code, country]
    );

    return result.rows[0];
};

exports.updateClient = async (id, clientData) => {
    const {
        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        postal_code,
        country,
    } = clientData;

    const checkClient = await db.query("SELECT id FROM clients WHERE id = $1", [
        id,
    ]);
    if (checkClient.rows.length === 0) {
        throw { status: 404, message: "Client not found" };
    }

    if (email) {
        const emailCheck = await db.query(
            "SELECT id FROM clients WHERE email = $1 AND id != $2",
            [email, id]
        );
        if (emailCheck.rows.length > 0) {
            throw { status: 400, message: "Email already in use by another client" };
        }
    }

    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (first_name !== undefined) {
        updates.push(`first_name = $${paramCounter}`);
        values.push(first_name);
        paramCounter++;
    }
    if (last_name !== undefined) {
        updates.push(`last_name = $${paramCounter}`);
        values.push(last_name);
        paramCounter++;
    }
    if (email !== undefined) {
        updates.push(`email = $${paramCounter}`);
        values.push(email);
        paramCounter++;
    }
    if (phone !== undefined) {
        updates.push(`phone = $${paramCounter}`);
        values.push(phone);
        paramCounter++;
    }
    if (address !== undefined) {
        updates.push(`address = $${paramCounter}`);
        values.push(address);
        paramCounter++;
    }
    if (city !== undefined) {
        updates.push(`city = $${paramCounter}`);
        values.push(city);
        paramCounter++;
    }
    if (postal_code !== undefined) {
        updates.push(`postal_code = $${paramCounter}`);
        values.push(postal_code);
        paramCounter++;
    }
    if (country !== undefined) {
        updates.push(`country = $${paramCounter}`);
        values.push(country);
        paramCounter++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `UPDATE clients SET ${updates.join(
        ", "
    )} WHERE id = $${paramCounter} RETURNING *`;
    const result = await db.query(query, values);

    return result.rows[0];
};

exports.deleteClient = async (id) => {
    const ordersCheck = await db.query(
        "SELECT COUNT(*) FROM orders WHERE client_id = $1",
        [id]
    );
    const orderCount = parseInt(ordersCheck.rows[0].count);

    if (orderCount > 0) {
        throw {
            status: 400,
            message: `Cannot delete client with ${orderCount} existing order(s). Consider archiving instead.`,
        };
    }

    const result = await db.query(
        "DELETE FROM clients WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "Client not found" };
    }
};