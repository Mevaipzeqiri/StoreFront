// src/services/userService.js
const bcrypt = require("bcryptjs");
const db = require("../config/database");

exports.getAllUsers = async (page, limit) => {
    const offset = (page - 1) * limit;

    const result = await db.query(
        `SELECT u.id, u.username, u.email, r.name as role, u.is_active, u.created_at
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         ORDER BY u.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await db.query("SELECT COUNT(*) FROM users");
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

exports.getAllRoles = async () => {
    const result = await db.query("SELECT * FROM roles ORDER BY id");
    return result.rows;
};

exports.getUserById = async (id) => {
    const result = await db.query(
        `SELECT u.id, u.username, u.email, r.name as role, u.is_active, u.created_at, u.updated_at
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "User not found" };
    }

    return result.rows[0];
};

exports.createUser = async (username, email, password, role) => {
    const existingUser = await db.query(
        "SELECT id FROM users WHERE email = $1 OR username = $2",
        [email, username]
    );

    if (existingUser.rows.length > 0) {
        throw {
            status: 400,
            message: "User with this email or username already exists",
        };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const roleQuery = await db.query("SELECT id FROM roles WHERE name = $1", [
        role || "simple_user",
    ]);

    if (roleQuery.rows.length === 0) {
        throw { status: 400, message: "Invalid role" };
    }

    const roleId = roleQuery.rows[0].id;

    const result = await db.query(
        `INSERT INTO users (username, email, password_hash, role_id, is_active)
         VALUES ($1, $2, $3, $4, true)
         RETURNING id, username, email, created_at`,
        [username, email, hashedPassword, roleId]
    );

    return {
        ...result.rows[0],
        role: role || "simple_user",
    };
};

exports.updateUser = async (id, username, email, role) => {
    const checkUser = await db.query("SELECT id FROM users WHERE id = $1", [id]);
    if (checkUser.rows.length === 0) {
        throw { status: 404, message: "User not found" };
    }

    if (username || email) {
        const duplicateCheck = await db.query(
            "SELECT id FROM users WHERE (username = $1 OR email = $2) AND id != $3",
            [username || "", email || "", id]
        );
        if (duplicateCheck.rows.length > 0) {
            throw {
                status: 400,
                message: "Username or email already in use by another user",
            };
        }
    }

    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (username !== undefined) {
        updates.push(`username = $${paramCounter}`);
        values.push(username);
        paramCounter++;
    }
    if (email !== undefined) {
        updates.push(`email = $${paramCounter}`);
        values.push(email);
        paramCounter++;
    }
    if (role !== undefined) {
        const roleQuery = await db.query("SELECT id FROM roles WHERE name = $1", [
            role,
        ]);
        if (roleQuery.rows.length === 0) {
            throw { status: 400, message: "Invalid role" };
        }
        updates.push(`role_id = $${paramCounter}`);
        values.push(roleQuery.rows[0].id);
        paramCounter++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
        UPDATE users 
        SET ${updates.join(", ")} 
        WHERE id = $${paramCounter} 
        RETURNING id, username, email, created_at, updated_at
    `;
    await db.query(query, values);

    const userWithRole = await db.query(
        `SELECT u.*, r.name as role 
         FROM users u 
         LEFT JOIN roles r ON u.role_id = r.id 
         WHERE u.id = $1`,
        [id]
    );

    return {
        id: userWithRole.rows[0].id,
        username: userWithRole.rows[0].username,
        email: userWithRole.rows[0].email,
        role: userWithRole.rows[0].role,
        is_active: userWithRole.rows[0].is_active,
        created_at: userWithRole.rows[0].created_at,
        updated_at: userWithRole.rows[0].updated_at,
    };
};

exports.resetUserPassword = async (id, new_password) => {
    const checkUser = await db.query("SELECT id FROM users WHERE id = $1", [id]);
    if (checkUser.rows.length === 0) {
        throw { status: 404, message: "User not found" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await db.query(
        "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [hashedPassword, id]
    );
};

exports.toggleUserStatus = async (id, currentUserId) => {
    if (parseInt(id) === currentUserId) {
        throw { status: 400, message: "Cannot deactivate your own account" };
    }

    const result = await db.query(
        `UPDATE users 
         SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING id, username, email, is_active`,
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "User not found" };
    }

    return result.rows[0];
};

exports.deleteUser = async (id, currentUserId) => {
    if (parseInt(id) === currentUserId) {
        throw { status: 400, message: "Cannot delete your own account" };
    }

    const result = await db.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "User not found" };
    }
};