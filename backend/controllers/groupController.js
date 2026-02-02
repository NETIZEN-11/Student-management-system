const Group = require('../models/Group');
const User = require('../models/User');
const logger = require('../utils/logger');

const groupController = {
  createGroup: async (req, res) => {
    try {
      const { name, description, members, maxMembers } = req.body;
      const createdBy = req.user.userId;

      const group = new Group({
        name,
        description,
        createdBy,
        members: members || [createdBy],
        maxMembers: maxMembers || 5,
      });

      await group.save();
      await group.populate('createdBy', 'name email');
      await group.populate('members', 'name email');

      logger.info(`Group created: ${group._id}`);
      res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
      logger.error('Create group error:', error);
      res.status(500).json({ message: 'Failed to create group' });
    }
  },

  getAllGroups: async (req, res) => {
    try {
      const groups = await Group.find({ isActive: true })
        .populate('createdBy', 'name email')
        .populate('members', 'name email')
        .sort({ createdAt: -1 });

      res.status(200).json({ groups });
    } catch (error) {
      logger.error('Get groups error:', error);
      res.status(500).json({ message: 'Failed to fetch groups' });
    }
  },

  getGroupById: async (req, res) => {
    try {
      const group = await Group.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('members', 'name email')
        .populate('tasks');

      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }

      res.status(200).json({ group });
    } catch (error) {
      logger.error('Get group error:', error);
      res.status(500).json({ message: 'Failed to fetch group' });
    }
  },

  addMember: async (req, res) => {
    try {
      const { groupId, memberId } = req.body;

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }

      // Check authorization
      if (group.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to add members' });
      }

      // Check if member already exists
      if (group.members.includes(memberId)) {
        return res.status(400).json({ message: 'Member already in group' });
      }

      // Check max members
      if (group.members.length >= group.maxMembers) {
        return res.status(400).json({ message: 'Group is full' });
      }

      group.members.push(memberId);
      await group.save();
      await group.populate('members', 'name email');

      logger.info(`Member added to group: ${groupId}`);
      res.status(200).json({ message: 'Member added successfully', group });
    } catch (error) {
      logger.error('Add member error:', error);
      res.status(500).json({ message: 'Failed to add member' });
    }
  },

  removeMember: async (req, res) => {
    try {
      const { groupId, memberId } = req.body;

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }

      // Check authorization
      if (group.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to remove members' });
      }

      group.members = group.members.filter((id) => id.toString() !== memberId);
      await group.save();
      await group.populate('members', 'name email');

      logger.info(`Member removed from group: ${groupId}`);
      res.status(200).json({ message: 'Member removed successfully', group });
    } catch (error) {
      logger.error('Remove member error:', error);
      res.status(500).json({ message: 'Failed to remove member' });
    }
  },

  deleteGroup: async (req, res) => {
    try {
      const groupId = req.params.id;

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }

      // Check authorization
      if (group.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this group' });
      }

      await Group.findByIdAndDelete(groupId);
      logger.info(`Group deleted: ${groupId}`);
      res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
      logger.error('Delete group error:', error);
      res.status(500).json({ message: 'Failed to delete group' });
    }
  },
};

module.exports = groupController;
