const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const logger = require('../utils/logger');

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        role: role || 'student',
      });

      await user.save();
      logger.info(`User registered: ${email}`);

      const token = generateToken(user._id, user.role);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      logger.info(`User logged in: ${email}`);

      const token = generateToken(user._id, user.role);

      res.status(200).json({
        message: 'Login successful',
        token,
        user: user.toJSON(),
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        user: user.toJSON(),
      });
    } catch (error) {
      logger.error('Get current user error:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  },
};

module.exports = authController;
