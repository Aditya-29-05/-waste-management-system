const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User and JWT token
 */
const registerUser = async ({ name, email, password, role, phone, address }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    phone,
    address
  });

  const token = generateToken({ id: user._id, role: user.role });

  return {
    user,
    token
  };
};

/**
 * Authenticate user credentials and generate token
 * @param {Object} credentials - Email and password
 * @returns {Object} User and JWT token
 */
const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Please provide email and password');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ id: user._id, role: user.role });

  return {
    user,
    token
  };
};

/**
 * Get profile for authenticated user
 * @param {string} userId - User ID
 * @returns {Object} User document
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
