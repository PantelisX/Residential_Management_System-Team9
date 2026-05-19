// backend/models/userModel.js
const db = require('../config/db');

// Find a user by email
async function findUserByEmail(email) {
  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const [rows] = await db.promise().query(sql, [email]);
  return rows[0] || null;
}

// Create a new user
async function createUser(user) {
  const sql = `INSERT INTO users (name, email, phone, password, is_technician) VALUES (?, ?, ?, ?, ?)`;
  const params = [
    user.name,
    user.email,
    user.phone,
    user.password,
    user.is_technician
  ];
  const [result] = await db.promise().execute(sql, params);
  return result;
}

module.exports = {
  findUserByEmail,
  createUser
};