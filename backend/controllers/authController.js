// backend/controllers/authController.js
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  try {
    const { name, email, phone, password, is_technician } = req.body;

    // Check if email already exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = {
      name,
      email,
      phone,
      password: hashedPassword,
      is_technician
    };

    // Save user to database
    await userModel.createUser(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

async function login(req, res) {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          is_technician: user.is_technician
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({
        message: 'Login successful',
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          is_technician: user.is_technician
        }
      });
    }  catch (err) {
        console.error('REGISTER ERROR:', err);
      
        res.status(500).json({
          message: 'Server error',
          error: err.message
        });
      }
  }

  async function getProfile(req, res) {
  try {
    const userId = req.user.user_id;
    const user = await userModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Success', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}


  async function updateProfile(req, res) {
  try {
    const userId = req.user.user_id;
    const { name, phone } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }

    const updatedUser = await userModel.updateUserProfile(userId, name.trim(), phone || null);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
  
console.log({
  register,
  login,
  getProfile,
  updateProfile
});

  module.exports = {register, login, getProfile, updateProfile};