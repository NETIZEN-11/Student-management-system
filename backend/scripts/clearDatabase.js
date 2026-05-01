/**
 * Database Clearing Script
 * Removes all existing data for fresh start
 * Run: node scripts/clearDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const Group = require('../models/Group');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-management';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[INFO] MongoDB connected');
  } catch (error) {
    console.error('[ERROR] MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    // Clear all collections
    await User.deleteMany({});
    await Task.deleteMany({});
    await Submission.deleteMany({});
    await Group.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    
    console.log('[INFO] ✅ Database cleared successfully!');
    console.log('[INFO] 🎯 You can now create your own accounts');
    console.log('[INFO] 📝 Visit http://localhost:3000/register to get started');

    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Clearing error:', error.message);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await clearDatabase();
};

main();