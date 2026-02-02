const User = require('../models/User');
const logger = require('../utils/logger');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const { role } = req.query;
      const filter = role ? { role } : {};

      const users = await User.find(filter).select('-password');
      res.status(200).json({ users });
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ user });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, bio, department, profilePicture } = req.body;
      const userId = req.params.id;

      // Check authorization
      if (req.user.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this user' });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (bio) updateData.bio = bio;
      if (department) updateData.department = department;
      if (profilePicture) updateData.profilePicture = profilePicture;

      const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select(
        '-password'
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      logger.info(`User updated: ${userId}`);
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;

      // Only admin can delete users
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can delete users' });
      }

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      logger.info(`User deleted: ${userId}`);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.error('Delete user error:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  },

  changeRole: async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.params.id;

      // Only admin can change roles
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can change user roles' });
      }

      const validRoles = ['student', 'mentor', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select(
        '-password'
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      logger.info(`User role changed: ${userId} to ${role}`);
      res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
      logger.error('Change role error:', error);
      res.status(500).json({ message: 'Failed to change user role' });
    }
  },
};

module.exports = userController;
