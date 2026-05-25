const db = require('../config/db');

// Find a user by email
async function findUserByEmail(email) {
  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const [rows] = await db.query(sql, [email]);
  return rows[0] || null;
}

/**
 * Get user by email
 */
async function getUserByEmail(email) {

  const sql = 'SELECT user_id FROM users WHERE email = ? LIMIT 1';
    
  const [rows] = 
    await db.execute( sql,[email]);

  return rows[0] || null;
}

// Create a new user
async function createUser(user) {
  const sql = `
    INSERT INTO users 
    (name, email, phone, password, is_technician)
    VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    user.name,
    user.email,
    user.phone,
    user.password,
    user.is_technician
  ];

  const [result] = await db.execute(sql, params);
  return result;
}

//Get all technicians
const getTechnicians = async (currentUserId) => {
  const sql = `SELECT user_id, name FROM users WHERE is_technician = 1 AND user_id != ?`;
  const [rows] = await db.query(sql, [currentUserId]);
  return rows;
}

// Get a user by ID
async function getUserById(userId) {
  const sql = 'SELECT user_id, name, email, phone, is_technician FROM users WHERE user_id = ? LIMIT 1';
  const [rows] = await db.query(sql, [userId]);
  return rows[0] || null;
}

// Update user profile (name and phone)
async function updateUserProfile(userId, name, phone) {
  const sql = 'UPDATE users SET name = ?, phone = ? WHERE user_id = ?';
  const [result] = await db.execute(sql, [name, phone, userId]);
  if (result.affectedRows === 0) {
    return null;
  }
  return getUserById(userId);
}

module.exports = {
  findUserByEmail,
  createUser,
  getTechnicians,
  getUserById,
  updateUserProfile,
  getUserByEmail
};