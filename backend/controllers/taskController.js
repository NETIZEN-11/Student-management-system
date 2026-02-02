const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

const taskController = {
  createTask: async (req, res) => {
    try {
      const { title, description, dueDate, priority, assignedTo, maxScore, tags } = req.body;

      // Only mentor and admin can create tasks
      if (!['mentor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only mentors and admins can create tasks' });
      }

      const task = new Task({
        title,
        description,
        dueDate,
        priority: priority || 'medium',
        createdBy: req.user.userId,
        assignedTo: assignedTo || [],
        maxScore: maxScore || 100,
        tags: tags || [],
      });

      await task.save();
      await task.populate('createdBy', 'name email');

      // Create notifications for assigned students
      if (assignedTo && assignedTo.length > 0) {
        for (const studentId of assignedTo) {
          await Notification.create({
            userId: studentId,
            type: 'task_assigned',
            title: 'New Task Assigned',
            message: `You have been assigned a new task: ${title}`,
            relatedId: task._id,
            relatedModel: 'Task',
          });
        }
      }

      logger.info(`Task created: ${task._id}`);
      res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
      logger.error('Create task error:', error);
      res.status(500).json({ message: 'Failed to create task' });
    }
  },

  getAllTasks: async (req, res) => {
    try {
      const { status, priority, createdBy } = req.query;
      const filter = {};

      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (createdBy) filter.createdBy = createdBy;

      const tasks = await Task.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 });

      res.status(200).json({ tasks });
    } catch (error) {
      logger.error('Get tasks error:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json({ task });
    } catch (error) {
      logger.error('Get task error:', error);
      res.status(500).json({ message: 'Failed to fetch task' });
    }
  },

  updateTask: async (req, res) => {
    try {
      const taskId = req.params.id;
      const { title, description, dueDate, priority, status, assignedTo, maxScore } = req.body;

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check authorization
      if (task.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (dueDate) updateData.dueDate = dueDate;
      if (priority) updateData.priority = priority;
      if (status) updateData.status = status;
      if (assignedTo) updateData.assignedTo = assignedTo;
      if (maxScore) updateData.maxScore = maxScore;

      const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');

      logger.info(`Task updated: ${taskId}`);
      res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
      logger.error('Update task error:', error);
      res.status(500).json({ message: 'Failed to update task' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const taskId = req.params.id;

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check authorization
      if (task.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this task' });
      }

      await Task.findByIdAndDelete(taskId);
      logger.info(`Task deleted: ${taskId}`);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      logger.error('Delete task error:', error);
      res.status(500).json({ message: 'Failed to delete task' });
    }
  },

  getStudentTasks: async (req, res) => {
    try {
      const studentId = req.user.userId;
      const tasks = await Task.find({ assignedTo: studentId })
        .populate('createdBy', 'name email')
        .sort({ dueDate: 1 });

      res.status(200).json({ tasks });
    } catch (error) {
      logger.error('Get student tasks error:', error);
      res.status(500).json({ message: 'Failed to fetch tasks' });
    }
  },
};

module.exports = taskController;
