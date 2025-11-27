const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

exports.registerUser = async (username, email, password, role) => {
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

    const newUser = result.rows[0];

    const token = jwt.sign(
        { userId: newUser.id, username: newUser.username, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    return {
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: role || "simple_user",
        },
        token,
    };
};

exports.loginUser = async (email, password) => {
    const result = await db.query(
        `SELECT u.id, u.username, u.email, u.password_hash, u.is_active, r.name as role
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.email = $1`,
        [email]
    );

    if (result.rows.length === 0) {
        throw { status: 401, message: "Invalid email or password" };
    }

    const user = result.rows[0];

    if (!user.is_active) {
        throw {
            status: 403,
            message: "Account is deactivated. Please contact administrator.",
        };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw { status: 401, message: "Invalid email or password" };
    }

    const token = jwt.sign(
        {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        token,
    };
};

exports.getUserProfile = async (userId) => {
    const result = await db.query(
        `SELECT u.id, u.username, u.email, r.name as role, u.is_active, u.created_at
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.id = $1`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "User not found" };
    }

    return result.rows[0];
};

exports.changeUserPassword = async (userId, currentPassword, newPassword) => {
    const result = await db.query(
        "SELECT password_hash FROM users WHERE id = $1",
        [userId]
    );

    if (result.rows.length === 0) {
        throw { status: 404, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(
        currentPassword,
        result.rows[0].password_hash
    );
    if (!isMatch) {
        throw { status: 401, message: "Current password is incorrect" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query(
        "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [hashedPassword, userId]
    );
};